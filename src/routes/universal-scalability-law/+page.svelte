<script lang="ts">
	import { levenbergMarquardt } from 'ml-levenberg-marquardt';
	import { LineChart } from '@carbon/charts-svelte';
	import {
		ChartTheme,
		ScaleTypes,
		type ChartTabularData,
		type LineChartOptions
	} from '@carbon/charts';

	let N: number[] = [1, 2, 3, 4]; // number of servers/processors
	let C: number[] = [500, 950, 1350, 1600]; // corresponding measured throughput

	const htmlElem = document.querySelector('html');
	let isDark = htmlElem?.getAttribute('data-theme') === 'dark';
	if (htmlElem) {
		const setAttribute = htmlElem.setAttribute;
		htmlElem.setAttribute = (key: string, value: string) => {
			if (key === 'data-theme') {
				isDark = value == 'dark';
			}
			setAttribute.call(htmlElem, key, value);
		};
	}

	// n = number of servers/processors
	// c = number of tasks for the 1st processing element
	function usl(n: number, c: number, alpha: number, beta: number) {
		return (n * c) / (1 + alpha * (n - 1) + beta * n * (n - 1));
	}

	// the USL fitting function
	function uslFitting(alphaBeta: number[]) {
		const alpha = alphaBeta[0];
		const beta = alphaBeta[1];
		return (n: number) => {
			return usl(n, C[0], alpha, beta);
		};
	}

	let alpha = 0.05;
	let beta = 0.02;

	function curveFitting() {
		// Using levenberg marquardt to get the coefficients that fit the curve
		const fittedParams = levenbergMarquardt(
			{
				x: N,
				y: C
			},
			uslFitting,
			{
				maxIterations: 10000,
				initialValues: [alpha, beta]
			}
		);
		console.log('fittedParams', fittedParams);
		alpha = fittedParams.parameterValues[0];
		beta = fittedParams.parameterValues[1];
	}

	function addField() {
		N = [...N, 0];
		C = [...C, 0];
	}

	$: options = {
		title: '',
		theme: isDark ? ChartTheme.G100 : ChartTheme.G10,
		axes: {
			left: {
				mapsTo: 'tasks',
				title: 'Tasks per second',
				scaleType: ScaleTypes.LINEAR,
				includeZero: false
			},
			bottom: {
				mapsTo: 'processors',
				title: 'Server/Processors',
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
		[...Array(16)].map((item, index) => {
			const processors = index + 1;
			return {
				processors: processors,
				tasks: usl(processors, C[0], alpha, beta)
			};
		})
	) satisfies ChartTabularData;
</script>

{#each N as server, i (i)}
	<div class="space-y-4">
		<input
			type="number"
			bind:value={N[i]}
			placeholder="Enter number of processors (N)"
			class="input input-bordered"
		/>
		<input
			type="number"
			bind:value={C[i]}
			placeholder="Enter tasks per second for N processors"
			class="input input-bordered"
		/>
	</div>
{/each}
<button on:click={addField} class="btn btn-primary">Add More</button>
<button on:click={curveFitting} class="btn btn-primary">Fit Curve</button>
<p>Estimate Alpha (α): {alpha}</p>
<p>Estimate Beta (β): {beta}</p>

<LineChart {data} {options} />
