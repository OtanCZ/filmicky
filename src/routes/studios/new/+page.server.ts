import { prisma } from '$lib/server/db';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'fs/promises';
import { getStudio } from '$lib/server/movies';

export const load: PageServerLoad = async () => {
	const loadedCountries = await prisma.countries.findMany();

	return { loadedCountries, studio: null };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const form = await request.formData();

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění přidat studio.' });
		}

		const name = form.get('name') as string;
		const country = form.get('country') as string;
		const file = form.get('image');

		let studioId = Number(params.id);
		const creatingNew = isNaN(studioId) || studioId === 0;

		const data = {
			name,
			country,
			logo_image_id: null
		};

		let currentImage = '';

		if (!creatingNew) {
			const currentStudio = await getStudio(studioId);
			currentImage = currentStudio?.images?.image_uri || '';
		}

		if (file && typeof file !== 'string' && file.name !== '') {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const fileName = `studio-${Date.now()}-${file.name}`;
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
			data.logo_image_id = image.id;
		}

		if (creatingNew) {
			const newStudio = await prisma.publishers.create({ data });
			studioId = newStudio.id;
		} else {
			await prisma.publishers.update({
				where: { id: studioId },
				data
			});
		}

		return redirect(302, `/studios/${studioId}`);
	}
};