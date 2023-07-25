<script lang="ts">
	import AmdahlLawCalculator from '../../components/AmdahlLawCalculator.svelte';
	import Collapse from '../../components/layout/Collapse.svelte';
	// @ts-ignore import svx extension for markdown
	import AmdahlFormulaDoc from '../../docs/amdahl-formula.md';
</script>

<svelte:head>
	<title>Amdahl's Law Calculator</title>
	<meta property="og:title" content="Amdahl's Law Calculator" />
	<meta property="og:description" content="" />
	<meta property="og:image" content="calculator-512.png" />
</svelte:head>

<div class="px-4 pb-8">
	<div class="text-2xl font-bold">Amdahl's Law Calculator</div>
	<AmdahlLawCalculator />
</div>

<Collapse title="What is Amdahl's Law?" isOpen={true}>
	<p>
		Amdahl's Law is a formula which finds the maximum improvement gained by improving a particular
		part of a system. It is often used in parallel computing to predict the theoretical maximum
		speedup using multiple processors.
	</p>
</Collapse>

<Collapse title="Amdahl's Law Formula">
	<article class="prose max-w-none">
		<AmdahlFormulaDoc />
	</article>
</Collapse>
