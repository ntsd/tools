<script lang="ts">
	import { base } from '$app/paths';
	import { pageDescription } from '../configs';
</script>

<p class="text-center mb-4 xl:mb-8 p-1">
	{pageDescription}
</p>
<div
	class="flex flex-col justify-around content-center gap-10 text-center text-lg lg:text-2xl font-bold"
>
	<div>
		<a class="link" href="{base}/universal-scalability-law">Universal Scalability Law Calculator</a>
	</div>
	<div>
		<a class="link" href="{base}/amdahl-law">Amdahl's Law Calculator</a>
	</div>
	<div>
		<a class="link" href="{base}/queueing-theory">Queueing Theory Calculator</a>
	</div>
</div>
