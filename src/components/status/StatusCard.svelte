<script>
	let { status, user } = $props();
	import { enhance } from '$app/forms';

	let editing = $state(false);
	let waiting = $state(false);
</script>

<div
	class="flex flex-row w-full h-full border border-my-secondary rounded-3xl shadow-lg transition-transform hover:scale-105 bg-black/30 justify-center items-end relative overflow-hidden">
	<div
		class="flex flex-col justify-between flex-end flex-grow items-center z-10 relative p-4 rounded-xl shadow-md">
		{#if !editing}
			<h2 class="text-lg font-semibold text-gray-200">{status.status}</h2>
			<div class="flex flex-row">
				{#if user}
					{#if user.user_permissions_id >= 2}
						<button
							class="btn btn-sm btn-ghost text-gray-200"
							onclick={() => (editing = true)}
							aria-label="Edit status">
							Upravit
						</button>
						<form use:enhance method="POST" action="?/delete">
							<button
								class="btn btn-sm btn-ghost text-gray-200"
								type="submit"
								onclick={() => (editing = false)}
								aria-label="Delete status">
								Smazat
							</button>
							<input type="hidden" name="statusId" value={status.id} />
						</form>
					{/if}
				{/if}
			</div>
		{/if}
		{#if editing && user && user.user_permissions_id >= 2}
			<form use:enhance={() => {
				return async ({update}) => {
					await update();
					editing = false;
					waiting = false;
				}
			}} method="POST" action="?/edit" onsubmit={() => (waiting = true)}>
				<input
					type="text"
					bind:value={status.status}
					name="status"
					class="input w-full"
					placeholder="Status"
				/>
				<button
					class={"btn btn-sm btn-ghost text-gray-200" + (waiting ? ' loading' : '')}
					type="submit"
					disabled={waiting}
					aria-label="Save status">
					Uložit
				</button>
				<input type="hidden" name="statusId" value={status.id} />
			</form>
		{/if}

	</div>
</div>