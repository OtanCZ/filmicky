<script lang="ts">
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores/toast';

	let { form } = $props();

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}
	});
</script>

<form class="h-screen flex items-center justify-center" method="post" action="?/login" use:enhance>
	<div class="card flex items-center">
		<div class="card-body items-center text-center justify-center bg-black/20 shadow-xl w-full">
			<h2 class="card-title justify-center">Registrace/Přihlášení</h2>
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Uživatelské jméno</legend>
				<input class="input validator" name="username" required placeholder="Uživatelské jméno"
							 pattern="[A-Za-z][A-Za-z0-9\-]*" minlength="3" maxlength="30" title="Only letters, numbers or dash" />
				<p class="validator-hint">
					Musí být 3 až 30 znaků.
				</p>
			</fieldset>
			<fieldset class="fieldset justify-center">
				<legend class="fieldset-legend">Heslo</legend>
				<input type="password" class="input validator" name="password" required placeholder="Heslo" minlength="6"
							 maxlength="32" title="Only letters, numbers or dash" />
				<p class="validator-hint">
					Musí být 6 až 32 znaků.
				</p>
			</fieldset>
			<div class="card-actions justify-center">
				<button class="btn">Přihlásit</button>
				<button class="btn" formaction="?/register">Registrovat</button>
			</div>
		</div>
	</div>
</form>