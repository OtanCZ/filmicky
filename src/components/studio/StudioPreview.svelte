<script>
	let { studio } = $props();
	console.log(studio);
</script>

<div class="flex flex-row w-full h-full bg-white border border-my-secondary rounded-3xl shadow-lg cursor-pointer transition-transform hover:scale-105 justify-center items-end relative overflow-hidden">
	<img
		src={studio.images?.image_uri ?? ''}
		alt="{studio.name} poster"
		class="absolute inset-0 w-full h-full object-cover rounded-2xl z-0"
	/>

	<button class="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer z-10" onclick={() => (window.location.href = `/studios/${studio.id}`)} aria-label={"View details of movie " + studio.name}>
	</button>

	<div class="flex flex-col border-t border-my-secondary justify-between mt-[100%] flex-end flex-grow items-center z-10 relative p-4 bg-black/60 rounded-xl shadow-md">
		<h2 class="text-md font-semibold text-gray-200">{studio.name}</h2>
		<p class="text-sm text-gray-200 italic">{studio.country}</p>
	</div>
</div>

