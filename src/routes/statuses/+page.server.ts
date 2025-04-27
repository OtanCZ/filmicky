import { getAllStatuses } from '$lib/server/movies';
import { type Actions, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async (event) => {
	const statuses = await getAllStatuses();

	return {
		user: event.locals.user,
		statuses
	};
};

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		const formData = await request.formData();
		console.log('Form data:', formData);
		const statusId = parseInt(formData.get('statusId') as string);
		const status = formData.get('status') as string;

		if (isNaN(statusId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění upravit status.' });
		}

		try {
			console.log('Edit role:', { statusId });

			await prisma.movie_status.update({
				where: {
					id: statusId,
				},
				data: {
					status
				}
			});

			return { success: true, message: 'Status byl úspěšně upraven.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se upravit status.' });
		}
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const statusId = parseInt(formData.get('statusId') as string);

		if (isNaN(statusId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění smazat status.' });
		}

		try {
			console.log('Delete status:', { statusId });

			await prisma.movie_status.delete({
				where: {
					id: statusId,
				}
			});

			return { success: true, message: 'Status byl úspěšně smazán.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat status.' });
		}
	},
	newStatus: async ({locals}) => {
		try {
			console.log('Adding status');

			if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
				return fail(403, { message: 'Nemáte oprávnění přidat status.' });
			}

			await prisma.movie_status.create({
				data: {
					status: "Nový status",
				}
			});

			return { success: true, message: 'Status byl úspěšně přidán.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se přidat status.' });
		}
	}
};
