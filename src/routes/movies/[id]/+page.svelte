<script lang="ts">
	import CommentForm from '../../../components/movie/CommentForm.svelte';
	import Comment from '../../../components/movie/Comment.svelte';
	import { toasts } from '$lib/stores/toast';
	import type { persons } from '@prisma/client';
	import { title } from '$lib/stores/title';

	let { data, form } = $props();

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');

			if (form?.message === 'Film byl úspěšně smazán.') {
				window.location.href = '/movies';
			}
		}
	});

	const grouped: Record<string, { person: persons, description: string | null }[]> = {};
	let averageRating = $state(0);

	const stars = Array.from({ length: 10 }, (_, i) => ({
		starValue: i + 1,
		maskClass: i % 2 === 0 ? 'mask-half-1' : 'mask-half-2'
	}));

	if (data.movie) {
		for (const mpr of data.movie.movie_person_role) {
			const roleName = mpr.roles.role || 'Other';

			if (!grouped[roleName]) {
				grouped[roleName] = [];
			}
			grouped[roleName].push({
				person: mpr.persons,
				description: mpr.description
			});

			if (data.movie) {
				const ratings = data.movie.comments
					.map(comment => comment.ratings?.rating)
					.filter((rating): rating is number => rating !== undefined && rating !== null);

				averageRating = ratings.length
					? ratings.reduce((acc, curr) => acc + curr, 0) / ratings.length
					: 0;


				averageRating = Math.round((averageRating ?? 0) / 2 * 2);
			}
		}
	}

	title.set('Film ' + (data.movie ? '' + data.movie.name : ''));
</script>

{#if data.movie}
	<div class="min-h-screen flex flex-col items-center p-6">
		<div class="w-full max-w-5xl">
			<div class="card lg:card-side bg-black/20 shadow-xl">
				<figure class="w-full lg:w-1/2">
					<img src={data.movie.movie_images[0]?.images.image_uri} alt={data.movie.name}
							 class="object-cover w-full h-full rounded-l-lg" />
				</figure>

				<div class="card-body w-full lg:w-1/2">
					<div class="flex flex-row justify-between">
						<h2 class="card-title text-3xl">{data.movie.name}</h2>
						<div class="rating rating-half">
							{#each stars as { starValue, maskClass } (starValue)}
								<div
									class="mask mask-star-2 {maskClass}"
									aria-label="{starValue} star"
									aria-current={averageRating === starValue}
								></div>
							{/each}
						</div>

					</div>
					<div class="space-y-2">
						<p><span class="font-semibold">Vydavatelství:</span>
							{#if data.movie.publishers}
								<a class="link link-primary" href={"/studios/" + data.movie.publishers.id}>
									{data.movie.publishers.name}
								</a>
								<span class="text-gray-500"> ({data.movie.publishers.country})</span>
							{/if}
						</p>

						<p><span class="font-semibold">Žánry:</span>
							{#each data.movie.movies_genres as genre (genre.id)}
								<span>
									{genre.genres.genre + " "}
								</span>
							{/each}
						</p>

						<p><span class="font-semibold">Stav:</span> {data.movie.movie_status?.status}</p>
						{#if data.movie.release_date}
							<p><span
								class="font-semibold">Datum vydání:</span> {new Date(data.movie.release_date).toLocaleDateString('cs-CZ')}
							</p>
						{/if}
						{#if data.movie.length}
							<p><span
								class="font-semibold">Délka:</span> {String(Math.floor(data.movie.length / 60)).padStart(2, '0') + ":" + String(data.movie.length % 60).padStart(2, '0')}
							</p>
						{/if}
						<span class="font-semibold">Popisek:</span>
						<p class="text-sm text-gray-300">{data.movie.description}</p>


						{#each Object.entries(grouped) as [role, people] (people)}
							<div class="my-2">
								<span class="font-semibold">{role}</span>
								{#each people as { person, description } (person)}
									<p>
										<a href={"/persons/" + person.id} class="link link-primary">
											{person.name} {person.surname}
										</a>
										{#if description}
											- {description}
										{/if}
									</p>
								{/each}
							</div>
						{/each}
					</div>
					<div class="card-actions justify-end">
						<div class="flex flex-row justify-center items-center gap-4">
							{#if data.user}
								{#if data.user.user_permissions_id >= 2}
									<a href={"/movies/" + data.movie.id + "/edit"} class="btn btn-primary">Upravit film</a>
									<form
										method="POST"
										action="?/deleteMovie"
										class="ml-auto">
										<input type="hidden" name="movieId" value={data.movie.id} />
										<button type="submit" class="btn btn-error">
											Smazat
										</button>
									</form>
								{/if}
							{/if}
						</div>
					</div>
				</div>
			</div>
			{#if data.user !== null}
				<CommentForm movieId={data.movie.id} />
			{/if}

			{#if data.movie.comments.length > 0}
				<div class="mt-6">
					<h3 class="text-2xl font-bold">Komentáře</h3>
					{#each data.movie.comments as comment (comment.id)}
						<Comment user={data.user} comment={comment} onProfile={false} />
					{/each}
				</div>
			{:else}
				<p class="text-gray-500">Žádné komentáře zatím nejsou.</p>
			{/if}
		</div>
	</div>
{/if}
