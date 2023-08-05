<script lang="ts">
	import QueuingTheoryCalculator from '../../components/QueuingTheoryCalculator.svelte';
	import Collapse from '../../components/layout/Collapse.svelte';
	// @ts-ignore import svx extension for markdown
	import QueuingTheoryDoc from '../../docs/queuing-theory.md';
	// @ts-ignore import svx extension for markdown
	import QueuingTheoryUsesDoc from '../../docs/queuing-theory-uses.md';
</script>

<div class="px-4 pb-8 space-y-4">
	<div class="text-lg lg:text-2xl font-bold pb-2 underline">Queuing Theory Calculator</div>
	<QueuingTheoryCalculator />
</div>

<Collapse title="What is Queuing Theory?">
	<article class="prose max-w-none">
		<QueuingTheoryDoc />
	</article>
</Collapse>

<Collapse title="Queuing Theory Uses">
	<article class="prose max-w-none">
		<QueuingTheoryUsesDoc />
	</article>
</Collapse>