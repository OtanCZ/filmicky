<script lang="ts">
	let { data } = $props();
</script>

<div class="flex flex-col min-h-screen items-center justify-center gap-8">
	<h1 class="text-4xl font-bold text-center">Vítejte na Filmíčkách 🎬</h1>
	{#if data.user}
		{#if data.user.user_permissions_id ?? 0 >= 2}
			<div class="shadow-lg">
				<div>
					<span>Jste administrátor. Můžete spravovat filmy, komentáře a další..</span>
				</div>
			</div>
			{:else}
			<div class="shadow-lg">
				<div>
					<span>Jste přihlášen jako {data.user.username}.</span>
				</div>
			</div>
		{/if}
		{:else}
		<div class="shadow-lg">
			<div>
				<span>Nejste přihlášen. Přihlaste se pro plný přístup.</span>
			</div>
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 items-center lg:grid-cols-3 gap-6 w-full max-w-5xl">
		<div class="card bg-black/20 shadow-md p-6 rounded-xl text-center">
			<h2 class="text-2xl font-semibold">Filmy</h2>
			<p class="text-4xl mt-2">{data.movieCount}</p>
		</div>

		<div class="card bg-black/20 shadow-md p-6 rounded-xl text-center">
			<h2 class="text-2xl font-semibold">Uživatelé</h2>
			<p class="text-4xl mt-2">{data.userCount}</p>
		</div>

		<div class="card bg-black/20 shadow-md p-6 rounded-xl text-center">
			<h2 class="text-2xl font-semibold">Komentáře</h2>
			<p class="text-4xl mt-2">{data.commentCount}</p>
		</div>
	</div>
</div>
