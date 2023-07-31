/** @type {() => import('svelte/types/compiler/preprocess').PreprocessorGroup} */
export default function () {
	return {
		name: 'custom-preprocessor',
		markup({ content, filename }) {
			return { code: content };
		},
		script({ content, filename, markup, attributes }) {
			return { code: content };
		},
		style({ content, filename, markup, attributes }) {
			return { code: content };
		}
	};
}
