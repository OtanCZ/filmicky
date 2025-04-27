<script>
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast.js';
	import CountryCard from '../../components/country/CountryCard.svelte';

	let { data, form } = $props();

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}
	});

	$effect(() => {
		filteredCountries = data.countries.filter(country => (country.name?.toLowerCase()).includes(searchTerm.toLowerCase()));
	});

	let searchTerm = $state('');
	let filteredCountries = $state(data.countries);
</script>

<div class="flex flex-col min-h-screen items-center">
	<div class="w-screen xl:w-[80%] flex flex-col">
		<div class="flex flex-row justify-between items-center">
			<div class="text-2xl font-bold">Země</div>
			{#if data.user}
				{#if data.user.user_permissions_id >= 2}
					<form use:enhance action="?/newCountry" method="POST">
						<button type="submit" class="btn btn-primary">
							Přidat novou zemi
						</button>
					</form>
				{/if}
			{/if}
		</div>

		<div class="flex flex-row items-center">
			<input type="text" placeholder="Hledat..." class="input" bind:value={searchTerm} />
		</div>

		<div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
			{#each filteredCountries as country (country.name)}
				<CountryCard country={country} user={data.user} />
			{/each}
		</div>
	</div>
</div>