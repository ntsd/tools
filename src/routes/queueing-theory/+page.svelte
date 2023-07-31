<script lang="ts">
	import QueueingTheoryCalculator from '../../components/QueueingTheoryCalculator.svelte';
	import Collapse from '../../components/layout/Collapse.svelte';
	// @ts-ignore import svx extension for markdown
	import QueueingTheoryDoc from '../../docs/queueing-theory.md';
</script>

<div class="px-4 pb-8 space-y-4">
	<div class="text-lg lg:text-2xl font-bold">Queueing Theory Calculator</div>
	<QueueingTheoryCalculator />
</div>

<Collapse title="What is Queueing Theory?">
	<article class="prose max-w-none">
		<QueueingTheoryDoc />
	</article>
</Collapse>
