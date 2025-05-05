<script lang="ts">

	import NewMoviePreview from '../../components/movie/NewMoviePreview.svelte';
	import MoviePreview from '../../components/movie/MoviePreview.svelte';
	import { title } from '$lib/stores/title';

	let { data } = $props();

	let searchTerm = $state('');
	let selectedStatus = $state('');
	let selectedPublisher = $state('');
	let minYear = $state('');
	let maxYear = $state('');

	let filteredMovies = $state(data.movies);

	$effect(() => {
		filteredMovies = data.movies.filter(movie => {
			const matchesName = movie.name?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesDescription = movie.description?.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesPublisher = selectedPublisher ? movie.publishers?.name === selectedPublisher : true;
			const matchesStatus = selectedStatus ? movie.movie_status?.status === selectedStatus : true;
			const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
			const matchesMinYear = minYear ? (releaseYear ? releaseYear >= parseInt(minYear) : false) : true;
			const matchesMaxYear = maxYear ? (releaseYear ? releaseYear <= parseInt(maxYear) : true) : true;

			return (matchesName || matchesDescription) && matchesPublisher && matchesStatus && matchesMinYear && matchesMaxYear;
		});
	});

	title.set('Filmy');
</script>

<div class="flex flex-col min-h-screen items-center">
	<div class="w-screen xl:w-[80%] flex flex-col">
		<div class="flex flex-row justify-between items-center mb-4">
			<div class="text-2xl font-bold">Filmy</div>
		</div>

		<div class="flex flex-wrap gap-4 mb-6 items-center">

			<input type="text" placeholder="Hledat název nebo popis..." class="input input-bordered w-64" bind:value={searchTerm} />

			<select class="select select-bordered" bind:value={selectedPublisher}>
				<option value="">Vydavatel</option>
				{#each [...new Set(data.movies.map(m => m.publishers?.name).filter(Boolean))] as publisher (publisher)}
					<option value={publisher}>{publisher}</option>
				{/each}
			</select>

			<select class="select select-bordered" bind:value={selectedStatus}>
				<option value="">Status</option>
				{#each [...new Set(data.movies.map(m => m.movie_status?.status).filter(Boolean))] as status (status)}
					<option value={status}>{status}</option>
				{/each}
			</select>

			<input type="number" placeholder="Min rok" class="input input-bordered w-24" bind:value={minYear} />
			<input type="number" placeholder="Max rok" class="input input-bordered w-24" bind:value={maxYear} />

			<button class="btn btn-outline btn-sm" onclick={() => {
				searchTerm = '';
				selectedStatus = '';
				selectedPublisher = '';
				minYear = '';
				maxYear = '';
			}}>
				Reset
			</button>

		</div>

		<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
			{#if data.user && data.user.user_permissions_id >= 2}
				<NewMoviePreview />
			{/if}
			{#each filteredMovies as movie (movie.id)}
				<MoviePreview {movie} />
			{/each}
		</div>
	</div>
</div>
