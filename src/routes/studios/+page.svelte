<script>
	import NewStudioPreview from '../../components/studio/NewStudioPreview.svelte';
	import StudioPreview from '../../components/studio/StudioPreview.svelte';
	import { title } from '$lib/stores/title.js';

	let { data } = $props();

	let searchTerm = $state('');
	let filteredStudios = $state(data.studios);

	title.set('Vydavatelství');

	$effect(() => {
		filteredStudios = data.studios.filter(studio => studio.name?.toLowerCase().includes(searchTerm.toLowerCase()));
	});
</script>

<div class="flex flex-col min-h-screen items-center">
	<div class="w-screen xl:w-[80%] flex flex-col">
		<div class="flex flex-row justify-between items-center mb-4">
			<div class="text-2xl font-bold">Vydavatelství</div>
		</div>

		<div class="flex flex-row items-center mb-6">
			<input type="text" placeholder="Hledat..." class="input" bind:value={searchTerm} />
		</div>

		<div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
			{#if data.user}
				{#if data.user.user_permissions_id >= 2}
					<NewStudioPreview />
				{/if}
			{/if}
			{#each filteredStudios as studio (studio.id)}
				<StudioPreview {studio} />
			{/each}
		</div>
	</div>
</div>