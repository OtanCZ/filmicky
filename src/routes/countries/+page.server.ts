import { getAllCountries } from '$lib/server/movies';
import { type Actions, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async (event) => {
	const countries = await getAllCountries();

	return {
		user: event.locals.user,
		countries
	};
};

export const actions: Actions = {
	edit: async ({ request, locals }) => {
		const formData = await request.formData();
		console.log('Form data:', formData);
		const countryId = formData.get('countryId') as string;
		const country = formData.get('country') as string;

		if (countryId === null || country === null) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění upravit zemi.' });
		}

		try {
			console.log('Edit genre:', { countryId });

			await prisma.countries.update({
				where: {
					name: countryId,
				},
				data: {
					name: country
				}
			});

			return { success: true, message: 'Země byla úspěšně upravena.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se upravit zemi.' });
		}
	},
	delete: async ({ request, locals }) => {
		const formData = await request.formData();
		const countryId = formData.get('countryId') as string;

		if (countryId === null) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění smazat zemi.' });
		}

		try {
			console.log('Delete genre:', { countryId });

			await prisma.countries.delete({
				where: {
					name: countryId,
				}
			});

			return { success: true, message: 'Země byla úspěšně smazána.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat zemi.' });
		}
	},
	newCountry: async ({locals}) => {
		try {
			console.log('Adding country');

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění přidat zemi.' });
		}

			await prisma.countries.create({
				data: {
					name: "Nová země",
				}
			});

			return { success: true, message: 'Země byla úspěšně přidána.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se přidat zemi.' });
		}
	}
};
