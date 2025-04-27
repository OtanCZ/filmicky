import { writable } from 'svelte/store';

function createTitle() {
	const {subscribe, set, update} = writable('');

	return {
		subscribe,
		set: (value: string) => {
			set(`${value} • Filmicky`)
		},
		clear: () => {
			set('Filmicky • Home');
		}
	}
}

export const title = createTitle();