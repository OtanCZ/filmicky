import { getAllGenres } from '$lib/server/movies';
import { type Actions, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async (event) => {
	const genres = await getAllGenres();

	return {
		user: event.locals.user,
		genres
	};
};

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		const formData = await request.formData();
		console.log('Form data:', formData);
		const genreId = parseInt(formData.get('genreId') as string);
		const genre = formData.get('genre') as string;

		if (isNaN(genreId) || genre.trim() === '') {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění upravit žánr.' });
		}

		try {
			console.log('Edit genre:', { genreId });

			await prisma.genres.update({
				where: {
					id: genreId,
				},
				data: {
					genre
				}
			});

			return { success: true, message: 'Žánr byl úspěšně upraven.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se upravit žánr.' });
		}
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const genreId = parseInt(formData.get('genreId') as string);

		if (isNaN(genreId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění smazat žánr.' });
		}

		try {
			console.log('Delete genre:', { genreId });

			await prisma.genres.delete({
				where: {
					id: genreId,
				}
			});

			return { success: true, message: 'Žánr byl úspěšně smazán.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat žánr.' });
		}
	},
	newGenre: async ({locals}) => {
		try {
			console.log('Adding genre');

			if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
				return fail(403, { message: 'Nemáte oprávnění přidat žánr.' });
			}

			await prisma.genres.create({
				data: {
					genre: "Nový žánr",
				}
			});

			return { success: true, message: 'Žánr byl úspěšně přidán.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se přidat žánr.' });
		}
	}
};
