<script lang="ts">
	import AmdahlLawCalculator from '../../components/AmdahlLawCalculator.svelte';
	import Collapse from '../../components/layout/Collapse.svelte';
	// @ts-ignore import svx extension for markdown
	import AmdahlDoc from '../../docs/amdahl-law.md';
	// @ts-ignore import svx extension for markdown
	import AmdahlFormulaDoc from '../../docs/amdahl-formula.md';
	import { pageURL } from '../../configs';
</script>

<svelte:head>
	<title>Amdahl's Law Calculator</title>
	<meta name="description" content="Calculate and visualize the Amdahl's Law for System Design" />
	<meta property="og:title" content="Amdahl's Law Calculator" />
	<meta property="og:description" content="Calculate and visualize the Amdahl's Law for System Design" />
	<meta property="og:image" content={`${pageURL}/calculator-512.png`} />
</svelte:head>

<div class="px-4 pb-8 space-y-4">
	<div class="text-lg lg:text-2xl font-bold">Amdahl's Law Calculator</div>
	<AmdahlLawCalculator />
</div>

<Collapse title="What is Amdahl's Law?">
	<article class="prose max-w-none">
		<AmdahlDoc />
	</article>
</Collapse>

<Collapse title="Amdahl's Law Formula">
	<article class="prose max-w-none">
		<AmdahlFormulaDoc />
	</article>
</Collapse>
