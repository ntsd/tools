<script lang="ts">
	import { base } from '$app/paths';
	import { githubLink, pageTitle } from '../../configs';
	import darkModeStore, { getDarkMode, setDarkMode } from '../../stores/darkModeStore';
	import Github from '../icons/Github.svelte';
	import SunMoon from '../icons/SunMoon.svelte';

	let darkMode = getDarkMode();
	darkModeStore.subscribe((darkMode) => {
		darkMode = darkMode;
	});
</script>

<div class="navbar w-full">
	<div class="navbar-start">
		<SunMoon onChange={setDarkMode} {darkMode} />
	</div>
	<div class="navbar-center lg:text-xl font-bold"><a href="{base}/">{pageTitle}</a></div>
	<div class="navbar-end">
		<a
			aria-label="Github"
			href={githubLink}
			target="_blank"
			rel="noopener noreferrer"
			class="btn btn-ghost drawer-button btn-square normal-case"
		>
			<Github />
		</a>
	</div>
</div>
