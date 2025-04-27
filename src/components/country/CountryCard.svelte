<script>
	let { country, user } = $props();
	import { enhance } from '$app/forms';

	let editing = $state(false);
	let waiting = $state(false);

	let countryOld = $state(country.name);
</script>

<div
	class="flex flex-row w-full h-full border border-my-secondary rounded-3xl shadow-lg transition-transform hover:scale-105 bg-black/30 justify-center items-end relative overflow-hidden">
	<div
		class="flex flex-col justify-between flex-end flex-grow items-center z-10 relative p-4 rounded-xl shadow-md">
		{#if !editing}
			<h2 class="text-lg font-semibold text-gray-200">{country.name}</h2>
			<div class="flex flex-row">
				{#if user}
					{#if user.user_permissions_id >= 2}
						<button
							class="btn btn-sm btn-ghost text-gray-200"
							onclick={() => (editing = true)}
							aria-label="Edit country">
							Upravit
						</button>
						<form use:enhance method="POST" action="?/delete">
							<button
								class="btn btn-sm btn-ghost text-gray-200"
								type="submit"
								onclick={() => (editing = false)}
								aria-label="Delete country">
								Smazat
							</button>
							<input type="hidden" name="countryId" value={country.name} />
						</form>
					{/if}
				{/if}
			</div>
		{/if}
		{#if editing && user && user.user_permissions_id >= 2}
			<form use:enhance={() => {
				return async ({update}) => {
					await update();
					countryOld = country.name;
					editing = false;
					waiting = false;
				}
			}} method="POST" action="?/edit" onsubmit={() => (waiting = true)}>
				<input
					type="text"
					bind:value={countryOld}
					name="country"
					class="input w-full"
					placeholder="Země"
				/>
				<button
					class={"btn btn-sm btn-ghost text-gray-200" + (waiting ? ' loading' : '')}
					type="submit"
					disabled={waiting}
					aria-label="Save country">
					Uložit
				</button>
				<input type="hidden" name="countryId" value={country.name} />
			</form>
		{/if}

	</div>
</div>