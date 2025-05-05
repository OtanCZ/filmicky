import { getMovie } from '$lib/server/movies';
import type { PageServerLoad } from '../../../../.svelte-kit/types/src/routes/auth/login/$types';
import { type Actions, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async (event) => {
	const id = parseInt(event.params.id);
	const movie = await getMovie(id);

	return {
		user: event.locals.user,
		movie
	};
};

export const actions: Actions = {
	commentReply:  async ({ request, locals }) => {
		const formData = await request.formData();

		const content = formData.get('replyContent') as string;
		const parentComment = parseInt(formData.get('parentCommentId') as string);

		console.log(content, parentComment);

		if (!content || isNaN(parentComment)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		try {
			console.log('New comment reply:', { content, parentComment });
			await prisma.comments.create({
				data: {
					comment: content,
					comment_id: parentComment,
					user_id: locals.user?.id,
					created_at: new Date(),
				}
			});

			return { success: true, message: 'Komentář byl úspěšně uložen.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se uložit komentář.' });
		}
	},

	newComment: async ({ request, locals }) => {
		const formData = await request.formData();

		const content = formData.get('content') as string;
		const rating = parseInt(formData.get('rating') as string);
		const movieId = parseInt(formData.get('movieId') as string);

		if (!content || isNaN(rating) || isNaN(movieId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		try {
			console.log('New comment:', { content, rating, movieId });

			const existingComment = await prisma.comments.findFirst({
				where: {
					movie_id: movieId,
					user_id: locals.user?.id,
				}
			});
			if (existingComment) {
				return fail(400, { message: 'Už jste ohodnotili tento film.' });
			}


			const comment = await prisma.comments.create({
				data: {
					comment: content,
					movie_id: movieId,
					user_id: locals.user?.id,
					created_at: new Date(),
				}
			})

			await prisma.ratings.create({
				data: {
					rating: rating,
					comment_id: comment.id,
				}
			});

			return { success: true, message: 'Komentář byl úspěšně uložen.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se uložit komentář.' });
		}
	},
	deleteComment: async ({ request, locals }) => {
		const formData = await request.formData();
		const commentId = parseInt(formData.get('commentId') as string);

		if (isNaN(commentId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění smazat komentář.' });
		}

		try {
			console.log('Delete comment:', { commentId });

			await prisma.comments.delete({
				where: {
					id: commentId,
				}
			});

			return { success: true, message: 'Komentář byl úspěšně smazán.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat komentář.' });
		}
	},
	deleteMovie: async ({ request, locals }) => {
		const formData = await request.formData();
		const movieId = parseInt(formData.get('movieId') as string);

		if (isNaN(movieId)) {
			return fail(400, { message: 'Neplatná data formuláře.' });
		}

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění smazat film.' });
		}

		try {
			console.log('Delete movie:', { movieId });

			await prisma.movies.delete({
				where: {
					id: movieId,
				}
			});

			return { success: true, message: 'Film byl úspěšně smazán.' };
		} catch (error) {
			console.error(error);
			return fail(500, { message: 'Nepodařilo se smazat film.' });
		}
	}
};
