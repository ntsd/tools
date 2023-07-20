<script lang="ts">
	import Amdahl from '../components/Amdahl.svelte';
	import Collapse from '../components/layout/Collapse.svelte';
	// @ts-ignore import svx extension for markdown
	import FormulaDoc from '../docs/formula.svx';
</script>

<div class="px-4 pb-8">
	<Amdahl />
</div>

<Collapse title="What is Amdahl's Law?" isOpen={true}>
	<p>
		Amdahl's Law is a formula which finds the maximum improvement gained by improving a particular
		part of a system. It is often used in parallel computing to predict the theoretical maximum
		speedup using multiple processors.
	</p>
</Collapse>

<Collapse title="Amdahl's Law Formula">
	<FormulaDoc />
</Collapse>
