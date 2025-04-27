<script>
	let { user } = $props();
</script>

<div class="navbar shadow-sm bg-my-secondary">
	<div class="navbar-start">
		<a class="btn btn-ghost xl:text-xl btn-sm xl:btn-md" href="/">Filmečky</a>
	</div>

	<div class="hidden sm:block navbar-center">
		<ul class="menu menu-horizontal px-1">
			<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/movies">Filmy</a></li>
			<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/studios">Vydavatelsví</a></li>
			<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/persons">Osobnosti</a></li>
			<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/genres">Žánry</a></li>
			<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/roles">Role</a></li>
			<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/statuses">Statusy</a></li>
			<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/countries">Země</a></li>
		</ul>
	</div>

	<div class="navbar-center sm:hidden">
		<ul class="menu menu-horizontal px-1">
			<li>
				<details>
					<summary>Navigace</summary>
					<ul class="bg-my-secondary rounded-t-none p-2 z-50">
						<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/movies">Filmy</a></li>
						<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/studios">Vydavatelsví</a></li>
						<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/persons">Osobnosti</a></li>
						<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/genres">Žánry</a></li>
						<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/roles">Role</a></li>
						<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/statuses">Statusy</a></li>
						<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/countries">Země</a></li>
					</ul>
				</details>
			</li>
		</ul>
	</div>

	<div class="navbar-end">
		{#if user}
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img
							alt="Pfp"
							src={user.images?.image_uri || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + user.username} />
					</div>
				</div>
				<ul
					tabindex="0"
					class="menu menu-sm dropdown-content bg-my-secondary rounded-box z-1 mt-3 w-52 p-2 shadow">
					<li>
						<a class="justify-between" href={`/profiles/${user.id}`}>
							Profil
						</a>
					</li>
					<li><a href="/auth/logout">Odhlásit</a></li>
				</ul>
			</div>
		{:else}
			<ul>
				<li><a class="btn-sm btn-ghost xl:btn-lg xl:text-lg" href="/auth/login">Přihlásit</a></li>
			</ul>
		{/if}
	</div>
</div>