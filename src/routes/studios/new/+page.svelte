<script>
	import StudioForm from '../../../components/studio/StudioForm.svelte';
	import { title } from '$lib/stores/title.js';
	export let data;

	title.set('Vytváření vydavatelství');
</script>

<StudioForm {...data} />