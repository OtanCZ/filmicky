<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { title } from '$lib/stores/title';

	let { data, form } = $props();

	const grouped: Record<string, { movie: any, description: string | null }[]> = {};

	if (data.person) {
		for (const mpr of data.person.movie_person_role) {
			const roleName = mpr.roles.role || 'Jiné';
			if (!grouped[roleName]) {
				grouped[roleName] = [];
			}
			grouped[roleName].push({
				movie: mpr.movies,
				description: mpr.description
			});
		}
	}

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}

		if (form?.message === 'Osobnost byla úspěšně smazána.') {
			window.location.href = '/persons';
		}
	});

	title.set('Osobnost ' + (data.person ? '' + data.person.name : ''));
</script>

{#if data.person}
	<div class="min-h-screen flex flex-col items-center p-6">
		<div class="w-full max-w-5xl">
			<div class="flex justify-end mb-4">
			</div>

			<div class="card lg:card-side bg-black/20 shadow-xl">
				<figure class="w-full lg:w-1/2">
					<img src={data.person.images?.image_uri ?? ''} alt={data.person.name}
							 class="object-cover w-full h-full rounded-l-lg" />
				</figure>

				<div class="card-body w-full lg:w-1/2">
					<h2 class="card-title text-3xl">{data.person.name + " " + data.person.surname}</h2>
					<div class="space-y-2">
						{#if data.person.date_of_birth}
							<p><span
								class="font-semibold">Datum narození:</span> {new Date(data.person.date_of_birth).toLocaleDateString('cs-CZ')}
							</p>
						{/if}
					</div>

					{#if Object.keys(grouped).length > 0}
							{#each Object.entries(grouped) as [role, movies] (role)}
								<div class="my-2">
									<span class="font-semibold">{role}</span>
										{#each movies as { movie, description } (movie.id)}
											<p>
												<a href={"/movies/" + movie.id} class="link link-primary">{movie.name}</a>
												{#if description}
													- {description}
												{/if}
											</p>
										{/each}
								</div>
							{/each}
					{/if}

					<div class="card-actions justify-end">
						<div class="flex flex-row justify-center items-center gap-4">
							{#if data.user}
								{#if data.user.user_permissions_id >= 2}
									<a href={"/persons/" + data.person.id + "/edit"} class="btn btn-primary">Upravit osobnost</a>
									<form
										method="POST"
										action=""
										class="ml-auto">
										<input type="hidden" name="personId" value={data.person.id} />
										<button type="submit" class="btn btn-error">
											Smazat
										</button>
									</form>
								{/if}
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
