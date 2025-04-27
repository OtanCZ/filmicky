<script>
	import PersonForm from '../../../components/persons/PersonForm.svelte';
	import { title } from '$lib/stores/title.js';
	export let data;

	title.set('Vytváření osoby');
</script>

<PersonForm {...data} />