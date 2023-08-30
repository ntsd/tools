import { persist, createLocalStorage } from '@macfja/svelte-persistent-store';
import { get, writable } from 'svelte/store';

function setTheme(darkMode: boolean) {
	document?.querySelector('html')?.setAttribute('data-theme', darkMode ? 'dark' : 'light');
}

const darkModeStore = persist(
	writable<boolean>(window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches || false),
	createLocalStorage(),
	'darkMode'
);

export function getDarkMode(): boolean {
	return get(darkModeStore);
}

export function setDarkMode(darkMode: boolean): void {
	setTheme(darkMode);
	darkModeStore.update(() => {
		return darkMode;
	});
}

export default darkModeStore;

setTheme(getDarkMode());
