
import { getAllStudios } from '$lib/server/movies';
import type { PageServerLoad } from '../../../.svelte-kit/types/src/routes/$types';

export const load: PageServerLoad = async (event) => {

	if (event.locals.user) {
		console.log(event.locals.user);
		return { user: event.locals.user, studios: await getAllStudios() };
	}
	return { user: null, studios: await getAllStudios()};
};