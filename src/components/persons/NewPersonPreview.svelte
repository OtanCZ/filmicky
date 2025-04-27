<div class="flex flex-row w-full h-full bg-white border border-my-secondary rounded-3xl shadow-lg transition-transform hover:scale-105 justify-center items-end relative overflow-hidden">
	<img
		src="https://i.redd.it/m0emsc1rx5he1.png"
		alt="New movie poster"
		class="absolute inset-0 w-full h-full object-cover rounded-2xl z-0"
	/>

	<button class="absolute inset-0 w-full h-full object-cover rounded-2xl z-0" onclick={() => (window.location.href = `/persons/new`)} aria-label="Add a new person">
	</button>

	<div class="flex flex-col border-t border-my-secondary justify-between mt-[100%] flex-end flex-grow items-center z-10 relative p-4 bg-black/30 rounded-xl shadow-md">
		<h2 class="text-lg font-semibold text-gray-200">New person</h2>
		<p class="text-sm text-gray-200 italic">Click to start creating</p>
	</div>
</div>

