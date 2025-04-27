import { prisma } from '$lib/server/db';
import { type Actions, redirect } from '@sveltejs/kit';
import fs from 'fs/promises';
import { checkProfileNameTaken, getProfile } from '$lib/server/movies';
import type { PageServerLoad } from '../../../../../.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async ({ params }) => {
	const loadedProfile = await getProfile(Number(params.id));
	if (!loadedProfile) throw Error('Profile not found');

	return { profile: loadedProfile };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const form = await request.formData();

		const username = form.get('name') as string;
		const description = form.get('description') as string;
		const file = form.get('image');

		let profileId = Number(params.id);
		if (!locals.user || profileId !== locals.user?.id) return { success: false, message: 'Uhh, proč edituješ profil někoho jinýho?? tbh přijde mi to funny takže to nechávám, užij si easteregg?' };

		if(await checkProfileNameTaken(username) && username !== locals.user?.username) return { success: false, message: 'Toto uživatelské jméno je již obsazeno.' };

		const data = {
			username,
			description,
			pfp_image: null
		};

		let currentImage = '';
		const currentProfile = await getProfile(profileId);
		currentImage = currentProfile?.images?.image_uri || '';

		if (file && typeof file !== 'string' && file.name !== '') {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const fileName = `profile-${Date.now()}-${file.name}`;
			const savePath = `static/uploads/${fileName}`;
			const publicPath = `/uploads/${fileName}`;

			await fs.writeFile(savePath, buffer);

			if (currentImage) {
				try {
					await fs.unlink(`static${currentImage}`);
				} catch (err) {
					console.error('Failed to delete old image:', err);
				}
			}

			const image = await prisma.images.create({
				data: {
					image_uri: publicPath
				}
			});

			// @ts-expect-error funny javascript behavior is funny
			data.pfp_image = image.id;
		}

		await prisma.users.update({
			where: { id: profileId },
			data
		});

		return redirect(302, `/profiles/${profileId}`);
	}
};
