<script lang="ts">
	import { pageDescription } from '../configs';
</script>

<svelte:head>
	<title>Scalability Calculators</title>
	<meta property="og:title" content="Scalability Calculators" />
	<meta property="og:description" content="" />
	<meta property="og:image" content="calculator-512.png" />
</svelte:head>

<p class="text-center mb-4 xl:mb-8 p-1">
	{pageDescription}
</p>
<div class="flex flex-col justify-center content-center text-center gap-10">
	<div>
		<a class="link text-4xl font-bold" href="/universal-scalability-law">Universal Scalability Law Calculator</a>
	</div>
	<div>
		<a class="link text-4xl font-bold" href="/amdahl-law">Amdahl's Law Calculator</a>
	</div>

	<div class="text-lg font-bold text-gray-500">Queuing Theory Calculator <span class="text-error">(coming soon)</span></div>

	<div class="text-lg font-bold text-gray-500">Little's Law Calculator <span class="text-error">(coming soon)</span></div>

	<div class="text-lg font-bold text-gray-500">Pollaczek–Khinchine formula Calculator <span class="text-error">(coming soon)</span></div>
</div>
