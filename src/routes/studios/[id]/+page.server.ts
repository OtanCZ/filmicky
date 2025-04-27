import { getStudio } from '$lib/server/movies';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/auth/login/$types';
import { type Actions, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const id = parseInt(event.params.id);
	const studio = await getStudio(id);

	return {
		user: event.locals.user,
		studio
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const studioId = parseInt(formData.get('studioId') as string);

		if (isNaN(studioId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění smazat studio.' });
		}

		try {
			console.log('Delete studio:', { studioId });

			await prisma.publishers.delete({
				where: {
					id: studioId,
				}
			});

			return { success: true, message: 'Vydavatelství bylo úspěšně smazáno.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat vydavatelství.' });
		}
	}
};
