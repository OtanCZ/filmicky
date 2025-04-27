import { getProfile } from '$lib/server/movies';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/auth/login/$types';
import { type Actions, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const id = parseInt(event.params.id);
	const profile = await getProfile(id);

	return {
		user: event.locals.user,
		profile
	};
};

export const actions: Actions = {
	delete:  async ({ request, locals }) => {
		const formData = await request.formData();
		const profileId = parseInt(formData.get('profileId') as string);

		if (isNaN(profileId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(locals.user?.user_permissions_id !== 3) return fail(403, { message: 'Nemáte oprávnění k této akci.' });

		try {
			console.log('Smazání uživatele: '+ profileId);

			await prisma.users.delete({
				where: {
					id: profileId,
				}
			});

			return { success: true, message: 'Uživatel byl úspěšně smazán.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat uživatele.' });
		}
	},
	user: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = parseInt(formData.get('profileId') as string);

		if (isNaN(userId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(locals.user?.user_permissions_id !== 3) return fail(403, { message: 'Nemáte oprávnění k této akci.' });

		try {
			console.log('Upravení uživatele: '+ userId);

			await prisma.users.update({
				where: {
					id: userId,
				},
				data: {
					user_permissions_id: 1
				}
			});

			return { success: true, message: 'Uživatel byl úspěšně upraven.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se upravit uživatele.' });
		}
	},
	moderator: async ({ request, locals }) => {
		const formData = await request.formData();
		const userId = parseInt(formData.get('profileId') as string);

		if (isNaN(userId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(locals.user?.user_permissions_id !== 3) return fail(403, { message: 'Nemáte oprávnění k této akci.' });

		try {
			console.log('Upravení uživatele: '+ userId);

			await prisma.users.update({
				where: {
					id: userId,
				},
				data: {
					user_permissions_id: 2
				}
			});

			return { success: true, message: 'Uživatel byl úspěšně upraven.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se upravit uživatele.' });
		}
	}
};