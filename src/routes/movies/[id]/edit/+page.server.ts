import { prisma } from '$lib/server/db';
import fs from 'fs';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getMovie } from '$lib/server/movies';

export const load: PageServerLoad = async ({ params }) => {
	const movie = await getMovie(Number(params.id));

	if (!movie) throw Error('Movie not found');
	const loadedGenres = await prisma.genres.findMany();
	const loadedStatuses = await prisma.movie_status.findMany();
	const loadedPublishers = await prisma.publishers.findMany();
	const loadedPersons = await prisma.persons.findMany();
	const loadedRoles = await prisma.roles.findMany();

	return { loadedGenres, loadedStatuses, loadedPublishers, loadedPersons, loadedRoles, movie };
};

export const actions: Actions = {
	default: async ({ request, params, locals }) => {
		let movieId = Number(params.id);
		const form = await request.formData();
		console.log(form);

		if(!locals.user || !(locals.user.user_permissions_id! >= 2)) {
			return fail(403, { message: 'Nemáte oprávnění upravit film.' });
		}

		const timeSplit = (form.get('length') as string).split(':') || [0, 0];
		const releaseDateString = form.get('release_date')?.toString();

		const data = {
			name: form.get('name') as string,
			description: form.get('description') as string,
			release_date: releaseDateString ? new Date(releaseDateString) : null,
			length: parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1]),
			movie_status_id: Number(form.get('movie_status_id')),
			publishers_id: Number(form.get('publishers_id'))
		};

		const personRoles = [];
		let i = 0;
		while (true) {
			const personId = form.get(`personRoles[${i}][personId]`);
			const roleId = form.get(`personRoles[${i}][roleId]`);
			const description = form.get(`personRoles[${i}][description]`);

			if (personId === null && roleId === null) break;

			if (personId !== null && roleId !== null) {
				personRoles.push({
					personId: Number(personId),
					roleId: Number(roleId),
					description: description ? String(description) : null
				});
			}

			i++;
		}

		const uniquePersonRoles = personRoles.filter(
			(role, index, self) =>
				index === self.findIndex((r) => r.personId === role.personId && r.roleId === role.roleId)
		);

		const genresId: number[] = [];
		i = 0;
		while (true) {
			const genre = form.get(`genresId[${i}]`);
			if (genre === null) break;
			genresId.push(Number(genre));
			i++;
		}

		let newMovie;

		if (params.id) {
			await prisma.movies.update({
				where: { id: Number(params.id) },
				data
			});
		} else {
			newMovie = await prisma.movies.create({ data });
			movieId = newMovie.id;
		}

		await prisma.movies_genres.deleteMany({
			where: {
				movie_id: movieId
			}
		});

		await prisma.movie_person_role.deleteMany({
			where: {
				movies_id: movieId
			}
		});

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
				data: uniquePersonRoles.map((personRole) => ({
					movies_id: movieId,
					persons_id: personRole.personId,
					roles_id: personRole.roleId,
					description: personRole.description
				}))
			});
		}

		let image_path = '';
		const file = form.get('image');
		if (file && typeof file !== 'string' && file.name !== '') {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const fileName = `movie-${Date.now()}-${file.name}`;
			const filePath = `static/uploads/${fileName}`; // Assuming you have /static/uploads

			await fs.promises.writeFile(filePath, buffer);

			image_path = `/uploads/${fileName}`;

			const currentImages = await prisma.movie_images.findMany({
				where: {
					movie_id: movieId
				},
				include: {
					images: true
				}
			});

			if (currentImages.length > 0) {
				for (const image of currentImages) {
					if (image.images.image_uri !== image_path) {
						const filePath = `static${image.images.image_uri}`;
						fs.unlink(filePath, (err) => {
							if (err) console.error(err);
						});
					}
				}
			}

			const image = await prisma.images.create({
				data: {
					image_uri: image_path
				}
			});

			await prisma.movie_images.deleteMany({
				where: {
					movie_id: movieId
				}
			});

			await prisma.movie_images.create({
				data: {
					movie_id: movieId,
					image_id: image.id
				}
			});
		}


		return redirect(302, '/movies/' + movieId);
	}
};
