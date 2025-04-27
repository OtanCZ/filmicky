import type { PageServerLoad } from '../../.svelte-kit/types/src/routes/auth/login/$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return { user: event.locals.user };
	}
	return { user: null };
};