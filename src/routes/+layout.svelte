<script lang="ts">
	import '../app.css';
	import Navbar from '../components/Navbar.svelte';
	import { toasts } from '$lib/stores/toast';


	let { children, data } = $props();
</script>

<div class="flex flex-col min-h-screen bg-my-background">
	<Navbar user={data.user} />
	<div class="toast toast-bottom toast-center z-50">
		{#each $toasts as toast (toast.id)}
			<div class="alert shadow-lg"
					 class:alert-success={toast.type === 'success'}
					 class:alert-error={toast.type === 'error'}
					 class:alert-info={toast.type === 'info'}>
				{toast.message}
			</div>
		{/each}
	</div>
	<div class="flex flex-col min-h-screen text-text">
		{@render children()}
	</div>
	<footer class="bg-my-secondary p-4 text-center">
		<p>TNPW2 & DBS2 zápočtový projekt | Otto Schön</p>
	</footer>
</div>
