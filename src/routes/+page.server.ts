import { prisma } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const movieCount = await prisma.movies.count();
	const userCount = await prisma.users.count();
	const commentCount = await prisma.comments.count();

	return { movieCount, userCount, commentCount, user: event.locals?.user ?? null };
};
