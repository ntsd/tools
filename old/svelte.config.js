import adapter from '@sveltejs/adapter-static';
import customAdaptor from './adaptor/index.js';
import htmlMinifierAdapter from 'sveltekit-html-minifier';
import customPreprocess from './preprocess/index.js';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.svx', '.md'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md']
		}),
		vitePreprocess(),
		customPreprocess()
	],

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: htmlMinifierAdapter(
			customAdaptor(
				adapter({
					strict: true
				})
			)
		),
		paths: {
			base: ''
		},
		prerender: {
			entries: ['*']
		}
	}
};

export default config;