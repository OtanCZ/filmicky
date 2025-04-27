<script lang="ts">
	import { enhance } from '$app/forms';

	let { movieId } = $props();
	let content = $state('');
	let rating = $state(0);
</script>

<form method="POST" action="?/newComment" class="card bg-black/20 shadow-lg p-4 my-6" use:enhance>
	<div class="flex flex-row justify-between items-center mb-4">
		<h3 class="font-bold text-lg">Napsat komentář</h3>
		<div class="rating rating-lg rating-half">
			<input type="radio" name="rating" class="rating-hidden" bind:group={rating} value="0" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-1" value="1" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-2" value="2" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-1" value="3" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-2" value="4" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-1" value="5" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-2" value="6" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-1" value="7" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-2" value="8" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-1" value="9" />
			<input type="radio" name="rating" class="mask mask-star-2 mask-half-2" value="10" />
		</div>
	</div>

	<input type="hidden" name="movieId" value={movieId} />
	<textarea
		name="content"
		bind:value={content}
		placeholder="Vaše recenze..."
		class="textarea textarea-bordered w-full mb-4"
		rows="3"
		required
	></textarea>

	<button type="submit" class="btn btn-primary w-full">
		Odeslat
	</button>
</form>
