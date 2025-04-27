<script>
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast.js';
	import GenreCard from '../../components/genre/GenreCard.svelte';
	import { title } from '$lib/stores/title.js';

	let { data, form } = $props();

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}
	});

	$effect(() => {
		filteredGenres = data.genres.filter(genre => (genre.genre?.toLowerCase()).includes(searchTerm.toLowerCase()));
	});

	let searchTerm = $state('');
	let filteredGenres = $state(data.genres);

	title.set('Žánry');
</script>

<div class="flex flex-col min-h-screen items-center">
	<div class="w-screen xl:w-[80%] flex flex-col">
		<div class="flex flex-row justify-between items-center">
			<div class="text-2xl font-bold">Žánry</div>
			{#if data.user}
				{#if data.user.user_permissions_id >= 2}
					<form use:enhance action="?/newGenre" method="POST">
						<button type="submit" class="btn btn-primary">
							Přidat nový žánr
						</button>
					</form>
				{/if}
			{/if}
		</div>

		<div class="flex flex-row items-center">
			<input type="text" placeholder="Hledat..." class="input" bind:value={searchTerm} />
		</div>

		<div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
			{#each filteredGenres as genre (genre.id)}
				<GenreCard genre={genre} user={data.user} />
			{/each}
		</div>
	</div>
</div>