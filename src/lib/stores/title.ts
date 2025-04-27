import { writable } from 'svelte/store';

function createTitle() {
	const {subscribe, set, update} = writable('');

	return {
		subscribe,
		set: (value: string) => {
			set(`${value} • Filmíčky`)
		},
		clear: () => {
			set('Filmíčky • Home');
		}
	}
}

export const title = createTitle();