<script>
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast.js';
	import RoleCard from '../../components/role/RoleCard.svelte';

	let { data, form } = $props();

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}
	});

	$effect(() => {
		filteredRoles = data.roles.filter(role => (role.role?.toLowerCase()).includes(searchTerm.toLowerCase()));
	});

	let searchTerm = $state('');
	let filteredRoles = $state(data.roles);
</script>

<div class="flex flex-col min-h-screen items-center">
	<div class="w-screen xl:w-[80%] flex flex-col">
		<div class="flex flex-row justify-between items-center">
			<div class="text-2xl font-bold">Role</div>
			{#if data.user}
				{#if data.user.user_permissions_id >= 2}
					<form use:enhance action="?/newRole" method="POST">
						<button type="submit" class="btn btn-primary">
							Přidat novou roli
						</button>
					</form>
				{/if}
			{/if}
		</div>

		<div class="flex flex-row items-center">
			<input type="text" placeholder="Hledat..." class="input" bind:value={searchTerm} />
		</div>

		<div class="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 w-full">
			{#each filteredRoles as role (role.id)}
				<RoleCard role={role} user={data.user} />
			{/each}
		</div>
	</div>
</div>