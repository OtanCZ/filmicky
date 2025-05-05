import { getAllPersons } from '$lib/server/movies';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async (event) => {

	if (event.locals.user) {
		return { user: event.locals.user, persons: await getAllPersons() };
	}
	return { user: null, persons: await getAllPersons()};
};