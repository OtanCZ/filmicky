<script>
	import StudioForm from '../../../../components/studio/StudioForm.svelte';
	import { toasts } from '$lib/stores/toast.js';
	let { form, data } = $props();

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}
	});
</script>

<StudioForm {...data} />