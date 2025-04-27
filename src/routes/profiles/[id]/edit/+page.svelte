<script>
	import ProfileForm from '../../../../components/profile/ProfileForm.svelte';
	import { toasts } from '$lib/stores/toast.js';
	import { title } from '$lib/stores/title.js';

	let { form, data } = $props();

	$effect(() => {
		if (form?.message) {
			toasts.add(form.message, form.success ? 'success' : 'error');
		}
	});

	title.set('Úprava profilu');
</script>

<ProfileForm {...data} />