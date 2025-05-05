<div class="flex flex-row w-full h-full bg-white border border-my-secondary rounded-3xl shadow-lg cursor-pointer transition-transform hover:scale-105 justify-center items-end relative overflow-hidden">
	<img
		src="https://i.redd.it/m0emsc1rx5he1.png"
		alt="New studio poster"
		class="absolute inset-0 w-full h-full object-cover rounded-2xl z-0"
	/>

	<button class="absolute inset-0 w-full h-full object-cover rounded-2xl cursor-pointer z-10" onclick={() => (window.location.href = `/studios/new`)} aria-label="Add a new studio">
	</button>

	<div class="flex flex-col border-t border-my-secondary justify-between mt-[100%] flex-end flex-grow items-center z-10 relative p-4 bg-black/60 rounded-xl shadow-md">
		<h2 class="text-md font-semibold text-gray-200">Nové vydavatelství</h2>
		<p class="text-sm text-gray-200 italic">Klikni pro vytvoření</p>
	</div>
</div>

