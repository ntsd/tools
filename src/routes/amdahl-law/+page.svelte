<script lang="ts">
	import AmdahlLawCalculator from '../../components/AmdahlLawCalculator.svelte';
	import Collapse from '../../components/layout/Collapse.svelte';
	// @ts-ignore import svx extension for markdown
	import AmdahlDoc from '../../docs/amdahl-law.md';
	// @ts-ignore import svx extension for markdown
	import AmdahlFormulaDoc from '../../docs/amdahl-law-formula.md';
</script>

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
