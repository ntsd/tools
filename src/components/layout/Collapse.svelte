<script lang="ts">
	export let title: string;
	export let isOpen: boolean = false;
</script>

<div tabindex="-1" class="collapse collapse-plus border border-base-300">
	<input type="radio" name="my-accordion-2" checked={isOpen} />
	<div class="collapse-title text-xl font-bold">
		{title}
	</div>
	<div class="collapse-content">
		<slot />
	</div>
</div>
