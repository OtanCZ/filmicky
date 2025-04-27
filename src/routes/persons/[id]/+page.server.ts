import { getPerson } from '$lib/server/movies';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/auth/login/$types';
import { type Actions, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const id = parseInt(event.params.id);
	const person = await getPerson(id);

	return {
		user: event.locals.user,
		person
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const personId = parseInt(formData.get('personId') as string);

		if (isNaN(personId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění smazat osobnost.' });
		}

		try {
			console.log('Delete person:', { personId });

			await prisma.persons.delete({
				where: {
					id: personId,
				}
			});

			return { success: true, message: 'Osobnost byla úspěšně smazána.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat osobnost.' });
		}
	}
};
