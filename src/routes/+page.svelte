<script lang="ts">
	import { base } from '$app/paths';
	import { pageDescription } from '../configs';
</script>

<svelte:head>
	<title>Scalability Calculators</title>
	<meta property="og:title" content="Scalability Calculators" />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:image" content={`${base}/calculator-512.png`} />
</svelte:head>

<p class="text-center mb-4 xl:mb-8 p-1">
	{pageDescription}
</p>
<div class="flex flex-col justify-center content-center text-center gap-10 text-lg lg:text-2xl font-bold">
	<div>
		<a class="link" href="{base}/universal-scalability-law">Universal Scalability Law Calculator</a>
	</div>
	<div>
		<a class="link" href="{base}/amdahl-law">Amdahl's Law Calculator</a>
	</div>

	<div class="text-gray-500">
		Queuing Theory Calculator <span class="text-error">(coming soon)</span>
	</div>

	<div class="text-gray-500">
		Pollaczek-Khinchine formula Calculator <span class="text-error">(coming soon)</span>
	</div>
</div>
