<script lang="ts">
	import { toasts } from '$lib/stores/toast';
	import { title } from '$lib/stores/title';

	let { data, form } = $props();

	title.set(data.studio?.name ?? 'Vydavatelství');

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}

		if (form?.message === 'Vydavatelství bylo úspěšně smazáno.') {
			window.location.href = '/studios';
		}
	});
</script>

{#if data.studio}
	<div class="min-h-screen flex flex-col items-center p-6">
		<div class="w-full max-w-5xl">
			<div class="flex justify-end mb-4">
			</div>

			<div class="card lg:card-side bg-black/20 shadow-xl">
				<figure class="w-full lg:w-1/2">
					<img src={data.studio.images?.image_uri ?? ''} alt={data.studio.name}
							 class="object-cover w-full h-full rounded-l-lg" />
				</figure>

				<div class="card-body w-full lg:w-1/2">
					<h2 class="card-title text-3xl">{data.studio.name}</h2>
					<div class="space-y-2">
						{#if data.studio.country}
							<p><span
								class="font-semibold">Původ:</span> {data.studio.country}
							</p>
						{/if}
					</div>
					<div class="card-actions justify-end">
						<a href="/studios" class="btn btn-primary">Zpět na seznam vydavatelství</a>
						{#if data.user}
							{#if data.user.user_permissions_id >= 2}
								<a href={"/studios/" + data.studio.id + "/edit"} class="btn btn-secondary">Upravit vydavatelství</a>
								<form
									method="POST"
									action=""
									class="ml-auto">
									<input type="hidden" name="studioId" value={data.studio.id} />
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
