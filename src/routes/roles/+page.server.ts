import { getAllRoles } from '$lib/server/movies';
import { type Actions, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async (event) => {
	const roles = await getAllRoles();

	return {
		user: event.locals.user,
		roles
	};
};

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		const formData = await request.formData();
		console.log('Form data:', formData);
		const roleId = parseInt(formData.get('roleId') as string);
		const role = formData.get('role') as string;

		if (isNaN(roleId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění upravit roli.' });
		}

		try {
			console.log('Edit role:', { roleId });

			await prisma.roles.update({
				where: {
					id: roleId,
				},
				data: {
					role
				}
			});

			return { success: true, message: 'Role byla úspěšně upravena.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se upravit roli.' });
		}
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const roleId = parseInt(formData.get('roleId') as string);

		if (isNaN(roleId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění smazat roli.' });
		}

		try {
			console.log('Delete role:', { roleId });

			await prisma.roles.delete({
				where: {
					id: roleId,
				}
			});

			return { success: true, message: 'Role byla úspěšně smazána.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat roli.' });
		}
	},
	newRole: async ({locals}) => {
		try {
			console.log('Adding role');

			if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
				return fail(403, { message: 'Nemáte oprávnění přidat roli.' });
			}

			await prisma.roles.create({
				data: {
					role: "Nová role",
				}
			});

			return { success: true, message: 'Role byla úspěšně přidána.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se přidat roli.' });
		}
	}
};
