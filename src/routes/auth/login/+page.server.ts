import { hash, verify } from '@node-rs/argon2';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import { prisma } from '$lib/server/db';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/$types';


export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, { message: 'Invalid username (min 3, max 31 characters, alphanumeric only)', success: false });
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)', success: false });
		}

		const results = await prisma.users.findMany({
			where: {
				username: username as string
			}
		})

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password', success: false });
		}

		const validPassword = await verify(existingUser.password_hash || '', password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password', success: false  });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expires_at);

		return redirect(302, '/');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if (!validateUsername(username)) {
			return fail(400, {
				message: 'Invalid username (min 3, max 31 characters, alphanumeric only)', success: false
			});
		}
		if (!validatePassword(password)) {
			return fail(400, { message: 'Invalid password (min 6, max 255 characters)', success: false  });
		}

		const results = await prisma.users.findMany({
			where: {
				username: username as string
			}
		})

		const existingUser = results.at(0);
		if (existingUser) {
			return fail(400, { message: 'Username already exists', success: false  });
		}

		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if(await prisma.user_permissions.count() === 0) {
			try {
				await prisma.user_permissions.create({
					data: {
						role: 'Uživatel',
					}
				});
				await prisma.user_permissions.create({
					data: {
						role: 'Moderátor',
					}
				});
				await prisma.user_permissions.create({
					data: {
						role: 'Administrátor',
					}
				});
			} catch (e) {
				console.log(e);
				return fail(500, { message: 'An error has occurred', success: false  });
			}
		}

		try {
			const newUser = await prisma.users.create({
				data: {
					user_permissions_id: 1,
					description: null,
					pfp_image: null,
					username: username as string,
					password_hash: passwordHash
				}
			})

			if(newUser.id === 1) {
				await prisma.users.update({
					where: { id: newUser.id },
					data: {
						user_permissions_id: 3
					}
				});
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, newUser.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expires_at);
		} catch (e) {
			console.log(e);
			return fail(500, { message: 'An error has occurred', success: false  });
		}
		return redirect(302, '/');
	}
};
function validateUsername(username: unknown): username is string {
	return (
		typeof username === 'string' &&
		username.length >= 3 &&
		username.length <= 31 &&
		/^[a-z0-9_-]+$/.test(username)
	);
}

function validatePassword(password: unknown): password is string {
	return typeof password === 'string' && password.length >= 6 && password.length <= 255;
}
