import { prisma } from '$lib/server/db';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'fs/promises';
import { getPerson } from '$lib/server/movies';

export const load: PageServerLoad = async ({ params }) => {
	const person = await getPerson(Number(params.id));
	if (!person) {
		throw new Error('Person not found');
	}

	return { person };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const form = await request.formData();

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění upravit osobnost.' });
		}

		const name = form.get('name') as string;
		const surname = form.get('surname') as string;
		const date_of_birth = form.get('date_of_birth') as string;
		const file = form.get('image');

		let personId = Number(params.id);
		const creatingNew = isNaN(personId) || personId === 0;

		const data = {
			name,
			surname,
			date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
			image_id: null
		};

		let currentImage = '';

		if (!creatingNew) {
			const currentPerson = await getPerson(personId);
			currentImage = currentPerson?.images?.image_uri || '';

			// @ts-expect-error funny javascript behavior is funny
			data.image_id = currentImage.id;
		}

		if (file && typeof file !== 'string' && file.name !== '') {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const fileName = `person-${Date.now()}-${file.name}`;
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
			data.image_id = image.id;
		}

		if (creatingNew) {
			const newPerson = await prisma.persons.create({ data });
			personId = newPerson.id;
		} else {
			await prisma.persons.update({
				where: { id: personId },
				data
			});
		}

		return redirect(302, `/persons/${personId}`);
	}
};