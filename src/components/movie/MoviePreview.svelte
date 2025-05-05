<script>
	let { movie } = $props();
	console.log(JSON.stringify(movie));
</script>

<div class="flex flex-row w-full h-full bg-white border border-my-secondary rounded-3xl cursor-pointer shadow-lg transition-transform hover:scale-105 justify-center items-end relative overflow-hidden">
	<img
		src={movie.movie_images[0]?.images.image_uri}
		alt="{movie.name} poster"
		class="absolute inset-0 w-full h-full object-cover rounded-2xl z-0"
	/>

	<button class="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer z-10" onclick={() => (window.location.href = `/movies/${movie.id}`)} aria-label={"View details of movie " + movie.name}>
	</button>

	<div class="flex flex-col border-t border-my-secondary justify-between mt-[100%] flex-end flex-grow items-center z-10 relative p-4 bg-black/60 rounded-xl shadow-md">
		<h2 class="text-md font-semibold text-gray-200">{movie.name}</h2>
		<p class="text-sm text-gray-200 italic">{movie.publishers?.name}</p>
		<p class="text-xs  text-gray-400 font-bold">{movie.movie_status?.status}</p>
	</div>
</div>

