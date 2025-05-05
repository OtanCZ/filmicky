<script lang="ts">
	import { title } from '$lib/stores/title';

	let { data } = $props();

	title.set('Profil uživatele ' + (data.profile ? data.profile.username : ''));
</script>

{#if data.profile}
	<div class="min-h-screen flex flex-col items-center p-6">
		<div class="w-full max-w-5xl">
			<div class="flex justify-end mb-4">
			</div>

			<div class="card lg:card-side bg-black/20 shadow-xl">
				<figure class="w-full lg:w-1/2">
					<img src={data.profile.images?.image_uri ?? ''} alt={data.profile.username}
							 class="object-cover w-full h-full rounded-l-lg" />
				</figure>

				<div class="card-body w-full lg:w-1/2">
					<h2 class="card-title text-3xl">{data.profile.username}</h2>
					{#if data.profile.user_permissions}
						<h3>{data.profile.user_permissions.role}</h3>
					{/if}
					<div class="space-y-2">
						{#if data.profile.description}
							<p><span
								class="font-semibold">Popis:</span> {data.profile.description}
							</p>
						{/if}
					</div>
					<div class="card-actions justify-end">
						{#if data.user}
							{#if data.user.id === data.profile.id}
								<a href={"/profiles/" + data.profile.id + "/edit"} class="btn btn-primary">Upravit profil</a>
							{/if}

							{#if data.user.user_permissions_id === 3}
								<form
									method="POST"
									action="?/delete"
									class="ml-auto">
									<input type="hidden" name="profileId" value={data.profile.id} />
									<button type="submit" class="btn btn-error">
										Smazat
									</button>
								</form>
								{#if data.profile.user_permissions_id === 2}
									<form
										method="POST"
										action="?/user"
										class="ml-auto">
										<input type="hidden" name="profileId" value={data.profile.id} />
										<button type="submit" class="btn btn-error">
											Ponížit na uživatele
										</button>
									</form>
								{/if}
								{#if data.profile.user_permissions_id === 1}
									<form
										method="POST"
										action="?/moderator"
										class="ml-auto">
										<input type="hidden" name="profileId" value={data.profile.id} />
										<button type="submit" class="btn btn-error">
											Povýšit na moderátora
										</button>
									</form>
								{/if}
							{/if}
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
