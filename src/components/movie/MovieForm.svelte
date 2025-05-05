<script lang="ts">
	let { movie, loadedGenres, loadedStatuses, loadedPublishers, loadedPersons, loadedRoles } = $props();
	let name = movie?.name ?? '';
	let description = movie?.description ?? '';
	let release_date = movie?.release_date?.toISOString().split('T')[0] ?? '';
	let length = String(Math.floor(movie?.length / 60)).padStart(2, '0') + ":" + String(movie?.length % 60).padStart(2, '0');
	let movie_status_id = movie?.movie_status_id ?? '';
	let publishers_id = movie?.publishers_id ?? '';

	type PersonRole = {
		personId: number;
		roleId: number;
		description: string;
	};

	let personRoles: PersonRole[] = $state([]);

	personRoles = movie?.movie_person_role?.map(pr => ({
		personId: pr.persons_id,
		roleId: pr.roles_id,
		description: pr.description
	})) ?? [];

	let genresId: number[] = $state(movie?.movies_genres?.map(mg => mg.genre_id) ?? []);
	console.log(movie);
	console.log(genresId)
</script>

<form class="" method="POST" enctype="multipart/form-data">
	<div class="flex flex-col justify-center items-center">
		<div class="card bg-black/20 shadow-lg p-4 my-6 w-full max-w-2xl">
			<div class="card-body items-center">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Název filmu</legend>
					<input class="input validator" name="name" bind:value={name} required placeholder="Název" minlength="3"
								 maxlength="64" title="Only letters, numbers or dash" />
					<p class="validator-hint">
						Musí být 3 až 64 znaků.
					</p>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Vydavatelství</legend>
					<select class="select" name="publishers_id" required bind:value={publishers_id}>
						{#each loadedPublishers as publisher (publisher.id)}
							<option value={publisher.id}>{publisher.name}</option>
						{/each}
					</select>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Status</legend>
					<select class="select" name="movie_status_id" required bind:value={movie_status_id}>
						{#each loadedStatuses as status (status.id)}
							<option value={status.id}>{status.status}</option>
						{/each}
					</select>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Popisek</legend>
					<textarea class="textarea h-24" name="description" bind:value={description} placeholder="Popisek"></textarea>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Datum vydání</legend>
					<input type="date" name="release_date" bind:value={release_date} class="input" />
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Délka filmu</legend>
					<input type="time" name="length" bind:value={length} class="input" />
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Osoby</legend>

					{#each personRoles as personRole, index (index)}
						<div class="flex gap-2 my-2">
							<select class="select" name="personRoles[{index}][personId]" bind:value={personRole.personId}>
								{#each loadedPersons as person (person.id)}
									<option value={person.id}>{person.name} {person.surname}</option>
								{/each}
							</select>

							<select class="select" name="personRoles[{index}][roleId]" bind:value={personRole.roleId}>
								{#each loadedRoles as role (role.id)}
									<option value={role.id}>{role.role}</option>
								{/each}
							</select>

							<input name="personRoles[{index}][description]" bind:value={personRole.description} class="input" placeholder="Popis role" />

							<button type="button" class="btn btn-sm btn-error" onclick={() => personRoles.splice(index, 1)}>
								X
							</button>
						</div>
					{/each}

					<button type="button" class="btn btn-sm btn-success mt-2" onclick={() => personRoles.push({ personId: loadedPersons[0]?.id ?? 0, roleId: loadedRoles[0]?.id ?? 0, description: '' })}>
						Přidat osobu
					</button>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Žánry</legend>

					{#each genresId as genreId, index (index)}
						<div class="flex gap-2 my-2">
							<select class="select" name="genresId[{index}]" bind:value={genresId[index]}>
								{#each loadedGenres as genre (genre.id)}
									<option value={genre.id}>{genre.genre}</option>
								{/each}
							</select>

							<button type="button" class="btn btn-sm btn-error" onclick={() => genresId.splice(index, 1)}>
								X
							</button>
						</div>
					{/each}

					<button type="button" class="btn btn-sm btn-success mt-2" onclick={() => genresId.push(loadedGenres[0]?.id ?? 0)}>
						Přidat žánr
					</button>
				</fieldset>


				<fieldset class="fieldset">
					<legend class="fieldset-legend">Obrázek (pro zanechání nechat prázdné)</legend>
					<input type="file" name="image" class="file-input" accept="image/*"/>
				</fieldset>

				<button type="submit" class="btn">{movie ? 'Aktualizovat' : 'Vytvořit'} Film</button>
			</div>
		</div>
	</div>
</form>
