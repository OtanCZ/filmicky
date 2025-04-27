import { prisma } from '$lib/server/db/index.ts';

export async function getAllMovies() {
	const movies = await prisma.movies.findMany({
		include: {
			movie_images: {
				include: {
					images: true,
				}
			},
			movie_person_role: {
				include: {
					persons: true,
					roles: true,
				}
			},
			movies_genres: {
				include: {
					genres: true,
				}
			},
			movie_status: true,
			publishers: true,
			comments: true,
		}
	});

	return movies;
}

export async function getMovie(id: number) {
	const movie = await prisma.movies.findUnique({
		where: { id: id },
		include: {
			movie_images: {
				include: {
					images: true,
				}
			},
			movies_genres: {
				include: {
					genres: true,
				}
			},
			movie_person_role: {
				include: {
					persons: true,
					roles: true,
				}
			},
			movie_status: true,
			publishers: true,
			comments: {
				include: {
					ratings: true,
					users: {
						include: {
							images: true,
						}
					},
					other_comments: {
						include: {
							users: {
								include: {
									images: true,
								}
							}
						}
					}
				}
			},
		}
	});

	return movie;
}

export async function getAllPersons() {
	const persons = await prisma.persons.findMany({
		include: {
			images: true,
		}
	});

	return persons;
}

export async function getPerson(id: number) {
	const person = await prisma.persons.findUnique({
		where: { id: id },
		include: {
			movie_person_role: {
				include: {
					movies: true,
					roles: true,
				}
			},
			images: true,
		}
	});

	return person;
}

export async function getAllStudios() {
	const studios = await prisma.publishers.findMany({
		include: {
			images: true,
		}
	});

	return studios;
}

export async function getStudio(id: number) {
	const studio = await prisma.publishers.findUnique({
		where: { id: id },
		include: {
			images: true,
		}
	});

	return studio;
}

export async function getAllRoles() {
	const roles = await prisma.roles.findMany({
		include: {


		}
	});

	return roles;
}

export async function getAllGenres() {
	const genres = await prisma.genres.findMany({
		include: {

		}
	});

	return genres;
}

export async function getAllCountries() {
	const countries = await prisma.countries.findMany({
		include: {

		}
	});

	return countries;
}

export async function getAllStatuses() {
	const statuses = await prisma.movie_status.findMany({
		include: {

		}
	});

	return statuses;
}

export async function getProfile(id: number) {
	const profile = await prisma.users.findUnique({
		where: { id: id },
		include: {
			images: true,
			user_permissions: true,
		}
	});

	console.log(profile);
	return profile;
}

export async function checkProfileNameTaken(name: string) {
	const profile = await prisma.users.findMany({
		where: { username: name },
	});

	return profile.length > 0;
}