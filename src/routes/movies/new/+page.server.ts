import { prisma } from '$lib/server/db';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs from 'fs/promises';

export const load: PageServerLoad = async () => {
	const loadedGenres = await prisma.genres.findMany();
	const loadedStatuses = await prisma.movie_status.findMany();
	const loadedPublishers = await prisma.publishers.findMany();
	const loadedPersons = await prisma.persons.findMany();
	const loadedRoles = await prisma.roles.findMany();

	return { loadedGenres, loadedStatuses, loadedPublishers, loadedPersons, loadedRoles, movie: null };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		const form = await request.formData();

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění přidat osobnost.' });
		}

		let movieId = Number(params.id);
		const creatingNew = isNaN(movieId) || movieId === 0;

		const name = form.get('name')?.toString().trim() ?? '';
		const description = form.get('description')?.toString().trim() ?? '';
		const releaseDateString = form.get('release_date')?.toString();
		const lengthStr = form.get('length')?.toString();
		const movieStatusIdStr = form.get('movie_status_id')?.toString();
		const publishersIdStr = form.get('publishers_id')?.toString();

		if (!name || !releaseDateString || !lengthStr || !movieStatusIdStr || !publishersIdStr) {
			throw new Error('Missing required movie fields.');
		}

		const data = {
			name,
			description,
			release_date: new Date(releaseDateString),
			length: parseInt(lengthStr),
			movie_status_id: Number(movieStatusIdStr),
			publishers_id: Number(publishersIdStr)
		};

		if (isNaN(data.length) || isNaN(data.movie_status_id) || isNaN(data.publishers_id)) {
			throw new Error('Invalid numeric values.');
		}

		const personRoles = [];
		let i = 0;
		while (true) {
			const personId = form.get(`personRoles[${i}][personId]`);
			const roleId = form.get(`personRoles[${i}][roleId]`);
			const roleDesc = form.get(`personRoles[${i}][description]`);

			if (personId === null && roleId === null) break;

			if (personId && roleId) {
				personRoles.push({
					personId: Number(personId),
					roleId: Number(roleId),
					description: roleDesc ? String(roleDesc) : null
				});
			}

			i++;
		}

		const uniquePersonRoles = personRoles.filter(
			(role, index, self) =>
				index === self.findIndex(
					(r) => r.personId === role.personId && r.roleId === role.roleId
				)
		);

		const genresId: number[] = [];
		i = 0;
		while (true) {
			const genre = form.get(`genresId[${i}]`);
			if (genre === null) break;
			const genreNum = Number(genre);
			if (!isNaN(genreNum)) {
				genresId.push(genreNum);
			}
			i++;
		}

		if (creatingNew) {
			const newMovie = await prisma.movies.create({ data });
			movieId = newMovie.id;
		} else {
			await prisma.movies.update({
				where: { id: movieId },
				data
			});

			await prisma.movies_genres.deleteMany({
				where: { movie_id: movieId }
			});

			await prisma.movie_person_role.deleteMany({
				where: { movies_id: movieId }
			});
		}

		if (genresId.length > 0) {
			await prisma.movies_genres.createMany({
				data: genresId.map((genreId) => ({
					movie_id: movieId,
					genre_id: genreId
				}))
			});
		}

		if (uniquePersonRoles.length > 0) {
			await prisma.movie_person_role.createMany({
				data: uniquePersonRoles.map((pr) => ({
					movies_id: movieId,
					persons_id: pr.personId,
					roles_id: pr.roleId,
					description: pr.description
				}))
			});
		}

		const file = form.get('image');
		if (file && typeof file !== 'string' && file.name !== '') {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const fileName = `movie-${Date.now()}-${file.name}`;
			const savePath = `static/uploads/${fileName}`;
			const publicPath = `/uploads/${fileName}`;

			await fs.writeFile(savePath, buffer);

			const currentImages = await prisma.movie_images.findMany({
				where: { movie_id: movieId },
				include: { images: true }
			});

			for (const image of currentImages) {
				try {
					if (image.images.image_uri !== publicPath) {
						await fs.unlink(`static${image.images.image_uri}`);
					}
				} catch (err) {
					console.error('Failed to delete old image:', err);
				}
			}

			await prisma.movie_images.deleteMany({
				where: { movie_id: movieId }
			});

			const newImage = await prisma.images.create({
				data: { image_uri: publicPath }
			});

			await prisma.movie_images.create({
				data: {
					movie_id: movieId,
					image_id: newImage.id
				}
			});
		}

		return redirect(302, `/movies/${movieId}`);
	}
};