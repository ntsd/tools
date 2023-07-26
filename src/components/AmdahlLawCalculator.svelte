<script lang="ts">
	import { LineChart } from '@carbon/charts-svelte';
	import {
		type LineChartOptions,
		type ChartTabularData,
		ChartTheme,
		ScaleTypes
	} from '@carbon/charts';
	import darkModeStore, { getDarkMode } from '../stores/darkModeStore';

	let percent = 90; // the percentage of the program that can be parallelized

	function calculateAmdalLaw(percent: number, processors: number) {
		return 1 / (1 - percent + percent / processors);
	}

	let isDark = getDarkMode();
	darkModeStore.subscribe((darkMode) => {
		isDark = darkMode;
	});

	$: maxSpeedup = 1 / (1 - percent / 100);
	$: options = {
		title: '',
		theme: isDark ? ChartTheme.G100 : ChartTheme.G10,
		axes: {
			left: {
				mapsTo: 'speedup',
				title: 'Speedup (times)',
				scaleType: ScaleTypes.LINEAR,
				includeZero: false
			},
			bottom: {
				mapsTo: 'processors',
				title: 'Number of Processors (s)',
				scaleType: ScaleTypes.LABELS
			}
		},
		height: '400px',
		legend: {
			enabled: false
		},
		toolbar: {
			enabled: false
		},
		tooltip: {
			groupLabel: ''
		}
	} satisfies LineChartOptions;
	$: data = Array.from(
		[1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024].map((item, index) => {
			const processors = item;
			return {
				processors: processors,
				speedup: calculateAmdalLaw(percent / 100, processors)
			};
		})
	) satisfies ChartTabularData;
</script>

<form class="space-y-4">
	<div class="flex justify-between items-center">
		<div>
			<span class="text-sm lg:text-lg">Parallelized Percent (p)</span>
			<p class="text-xs lg:text-md text-gray-500">
				Percentage of the program that can be parallelized.
			</p>
		</div>
		<div class="flex items-center gap-2">
			<input
				class="input input-bordered"
				id="p"
				type="number"
				min="0"
				max="100"
				bind:value={percent}
			/>
			<span class="font-extrabold">%</span>
		</div>
	</div>
	<div class="pb-2">
		<input
			type="range"
			min="0"
			max="100"
			bind:value={percent}
			class="range range-primary"
			step="1"
		/>
		<div class="w-full flex justify-between text-xs">
			<span>0%</span>
			<span>25%</span>
			<span>50%</span>
			<span>75%</span>
			<span>100%</span>
		</div>
	</div>
	<LineChart {data} {options} />
</form>
