import type { PageServerLoad } from '../../.svelte-kit/types/src/routes/auth/login/$types';
import { getAllMovies } from '$lib/server/movies';

export const load: PageServerLoad = async (event) => {

	if (event.locals.user) {
		console.log(event.locals.user);
		return { user: event.locals.user, movies: await getAllMovies() };
	}
	return { user: null, movies: await getAllMovies()};
};