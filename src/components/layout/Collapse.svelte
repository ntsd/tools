<script lang="ts">
	export let title: string;
	export let isOpen: boolean = true;
</script>

<div
	tabindex="-1"
	class="collapse border border-base-300 {isOpen ? 'collapse-open' : 'collapse-close'}"
>
	<div class="collapse-title text-lg lg:text-xl font-bold">
		{title}
	</div>
	<div class="collapse-content">
		<slot />
	</div>
</div>
