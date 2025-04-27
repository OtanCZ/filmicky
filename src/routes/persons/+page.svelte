<script>
	import NewPersonPreview from '../../components/persons/NewPersonPreview.svelte';
	import PersonPreview from '../../components/persons/PersonPreview.svelte';
	import { title } from '$lib/stores/title.js';

	let { data } = $props();

	let searchTerm = $state('');
	let filteredPersons = $state(data.persons);

	$effect(() => {
		filteredPersons = data.persons.filter(person => (person.name?.toLowerCase() + " " + person.surname?.toLowerCase()).includes(searchTerm.toLowerCase()));
	});

	title.set('Osobnosti');
</script>

<div class="flex flex-col min-h-screen items-center">
	<div class="w-screen xl:w-[80%] flex flex-col">
		<div class="flex flex-row justify-between items-center">
			<div class="text-2xl font-bold">Osobnosti</div>
		</div>

		<div class="flex flex-row items-center">
			<input type="text" placeholder="Hledat..." class="input" bind:value={searchTerm} />
		</div>

		<div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
			{#if data.user}
				{#if data.user.user_permissions_id >= 2}
					<NewPersonPreview />
				{/if}
			{/if}
			{#each filteredPersons as person (person.id)}
				<PersonPreview {person} />
			{/each}
		</div>
	</div>
</div>