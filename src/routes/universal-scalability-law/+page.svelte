<script lang="ts">
	import UslCalculator from '../../components/USLCalculator.svelte';
	import Collapse from '../../components/layout/Collapse.svelte';

	// @ts-ignore import svx extension for markdown
	import USLHowToDoc from '../../docs/usl-how-to.md';
	// @ts-ignore import svx extension for markdown
	import USLDoc from '../../docs/usl.md';
	// @ts-ignore import svx extension for markdown
	import USLFormulaDoc from '../../docs/usl-formula.md';
</script>

<div class="px-4 pb-8 space-y-4">
	<div class="text-lg lg:text-2xl font-bold pb-2 underline">Universal Scalability Law Calculator</div>
	<UslCalculator />
</div>

<Collapse title="How to use Universal Scalability Law Calculator?">
	<article class="prose max-w-none">
		<USLHowToDoc />
	</article>
</Collapse>

<Collapse title="What is The Universal Scalability Law?">
	<article class="prose max-w-none">
		<USLDoc />
	</article>
</Collapse>

<Collapse title="The Universal Scalability Law Formula">
	<article class="prose max-w-none">
		<USLFormulaDoc />
	</article>
</Collapse>
