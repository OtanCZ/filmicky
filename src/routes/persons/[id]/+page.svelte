<script lang="ts">
	import { toasts } from '$lib/stores/toast';

	let { data, form } = $props();

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}

		if (form?.message === 'Osobnost byla úspěšně smazána.') {
			window.location.href = '/persons';
		}
	});
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
					<div class="card-actions justify-end">
						<a href="/persons" class="btn btn-primary">Zpět na seznam osobností</a>
						{#if data.user}
							{#if data.user.user_permissions_id >= 2}
								<a href={"/persons/" + data.person.id + "/edit"} class="btn btn-secondary">Upravit osobnost</a>
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
{/if}
