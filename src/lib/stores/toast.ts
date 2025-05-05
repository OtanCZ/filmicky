import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
	id: number;
	message: string;
	type: ToastType;
}

const { subscribe, update } = writable<Toast[]>([]);

let toastId = 0;

export const toasts = {
	subscribe,
	add(message: string, type: ToastType = 'info') {
		const id = toastId++;
		update((all) => [...all, { id, message, type }]);
		setTimeout(() => {
			toasts.remove(id);
		}, 3000);
	},
	remove(id: number) {
		update((all) => all.filter((t) => t.id !== id));
	}
};
