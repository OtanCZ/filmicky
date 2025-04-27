<script lang="ts">
	let { profile } = $props();
	let name = profile?.username ?? '';
	let description = profile?.country ?? '';
</script>

<form class="" method="POST" enctype="multipart/form-data">
	<div class="flex flex-col justify-center items-center">
		<div class="card bg-black/20 shadow-lg p-4 my-6 w-full max-w-2xl">
			<div class="card-body items-center">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Uživatelské jméno</legend>
					<input class="input validator" name="name" bind:value={name} required placeholder="Název" minlength="3"
								 maxlength="64" title="Only letters, numbers or dash" />
					<p class="validator-hint">
						Musí být 3 až 64 znaků.
					</p>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Popis</legend>
					<textarea
						name="description"
						bind:value={description}
						placeholder="Popis..."
						class="textarea"
						rows="3"
					></textarea>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Obrázek (pro zanechání nechat prázdné)</legend>
					<input type="file" name="image" class="file-input" accept="image/*"/>
				</fieldset>

				<button type="submit" class="btn">Aktualizovat profil</button>
			</div>
		</div>
	</div>
</form>
