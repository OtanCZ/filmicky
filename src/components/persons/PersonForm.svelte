<script lang="ts">
	let { person } = $props();
	let name = person?.name ?? '';
	let surname = person?.surname ?? '';
	let date_of_birth = person?.dateOfBirth?.toISOString().split('T')[0] ?? '';
</script>

<form class="" method="POST" enctype="multipart/form-data">
	<div class="flex flex-col justify-center items-center">
		<div class="card bg-black/20 shadow-lg p-4 my-6 w-full max-w-2xl">
			<div class="card-body items-center">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Jméno</legend>
					<input class="input validator" name="name" bind:value={name} required placeholder="Jméno" minlength="3"
								 maxlength="64" title="Only letters, numbers or dash" />
					<p class="validator-hint">
						Musí být 3 až 64 znaků.
					</p>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Příjmení</legend>
					<input class="input validator" name="surname" bind:value={surname} required placeholder="Příjmení" minlength="3"
								 maxlength="64" title="Only letters, numbers or dash" />
					<p class="validator-hint">
						Musí být 3 až 64 znaků.
					</p>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Datum narození</legend>
					<input type="date" name="date_of_birth" bind:value={date_of_birth} class="input" />
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Obrázek (pro zanechání nechat prázdné)</legend>
					<input type="file" name="image" class="file-input" accept="image/*"/>
				</fieldset>

				<button type="submit" class="btn">{person ? 'Aktualizovat' : 'Vytvořit'} osobnost</button>
			</div>
		</div>
	</div>
</form>
