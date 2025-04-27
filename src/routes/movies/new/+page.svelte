<script>
	import MovieForm from '../../../components/movie/MovieForm.svelte';
	import { title } from '$lib/stores/title.js';
	export let data;

	title.set('Vytváření filmu');
</script>

<MovieForm {...data} />