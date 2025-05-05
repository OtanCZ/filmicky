<script lang="ts">
	let { studio, loadedCountries } = $props();
	let name = studio?.name ?? '';
	let country = studio?.country ?? '';
</script>

<form class="" method="POST" enctype="multipart/form-data">
	<div class="flex flex-col justify-center items-center">
		<div class="card bg-black/20 shadow-lg p-4 my-6 w-full max-w-2xl">
			<div class="card-body items-center">

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Název studia</legend>
					<input class="input validator" name="name" bind:value={name} required placeholder="Název" minlength="3"
								 maxlength="64" title="Only letters, numbers or dash" />
					<p class="validator-hint">
						Musí být 3 až 64 znaků.
					</p>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Původ</legend>
					<select class="select" name="country" required bind:value={country}>
						{#each loadedCountries as country (country)}
							<option value={country.name}>{country.name}</option>
						{/each}
					</select>
				</fieldset>

				<fieldset class="fieldset">
					<legend class="fieldset-legend">Obrázek (pro zanechání nechat prázdné)</legend>
					<input type="file" name="image" class="file-input" accept="image/*"/>
				</fieldset>

				<button type="submit" class="btn btn-primary">{studio ? 'Aktualizovat' : 'Vytvořit'} vydavatelství</button>
			</div>
		</div>
	</div>
</form>
