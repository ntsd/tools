<script lang="ts">
	import { levenbergMarquardt } from 'ml-levenberg-marquardt';
	import { LineChart } from '@carbon/charts-svelte';
	import {
		ChartTheme,
		ScaleTypes,
		type ChartTabularData,
		type LineChartOptions
	} from '@carbon/charts';
	import darkModeStore, { getDarkMode } from '../stores/darkModeStore';
	let isDark = getDarkMode();
	darkModeStore.subscribe((darkMode) => {
		isDark = darkMode;
	});

	interface USLElement {
		// number of concurrency (servers/processors)
		N: number;
		// corresponding measured throughput
		C: number;
	}

	let uslElements: USLElement[] = [
		{ N: 1, C: 1800 },
		{ N: 2, C: 3302 },
		{ N: 4, C: 5179 },
		{ N: 8, C: 5829 }
		// { N: 1, C: 500 },
		// { N: 2, C: 990 },
		// { N: 3, C: 1470 },
		// { N: 4, C: 1940 }
	];
	let alpha = 0.05;
	let beta = 0.02;
	let error = 0;
	let scalabilityLimit = 7;
	let chartConcurrencies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	function sortUSLElems() {
		uslElements = uslElements.sort((a, b) => a.N - b.N);
	}

	function onNChange(
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		},
		index: number
	) {
		const newValue = e.currentTarget.value;

		if (!Number(newValue) || Number(newValue) <= 1) {
			uslElements[index].N = 2;
		}

		sortUSLElems();
	}

	function addUSLElem() {
		uslElements = [...uslElements, { N: uslElements[uslElements.length - 1].N + 1, C: 0 }];
	}

	function removeUSLElem(index: number) {
		uslElements = uslElements.filter((e, i) => i !== index);
	}

	// n = number of concurrency (servers/processors)
	// c = number of tasks for the 1st processing element
	function usl(n: number, c: number, alpha: number, beta: number) {
		return (n * c) / (1 + alpha * (n - 1) + beta * n * (n - 1));
	}

	// the USL fitting function
	function uslFitting(alphaBeta: number[]) {
		const alpha = alphaBeta[0];
		const beta = alphaBeta[1];
		return (n: number) => {
			return usl(n, uslElements[0].C, alpha, beta);
		};
	}

	function findScalabilityLimit(alpha: number, beta: number, max: number): number {
		let scalabilityLimit = 0;
		let prevCapacity = 0;

		// We assume the maximum potential number of servers to be some large number (e.g., 1000)
		// You can adjust this value based on your practical need
		for (let N = 1; N <= max; N++) {
			const currCapacity = N / (1 + alpha * (N - 1) + beta * N * (N - 1));

			if (currCapacity < prevCapacity) {
				scalabilityLimit = N - 1;
				break;
			}

			prevCapacity = currCapacity;
		}

		return scalabilityLimit;
	}

	function curveFitting() {
		let listOfN: number[] = [];
		let listOfC: number[] = [];
		uslElements.forEach((elem) => {
			listOfN.push(elem.N);
			listOfC.push(elem.C);
		});

		// Using levenberg marquardt to get the coefficients that fit the curve
		const fittedParams = levenbergMarquardt(
			{
				x: listOfN,
				y: listOfC
			},
			uslFitting,
			{
				maxIterations: 100000,
				minValues: [0, 0],
				maxValues: [1, 1],
				gradientDifference: 10e-4, // step up/down by 0.001
				// errorTolerance: C[0]/10, // stop if error less than first element / 10
				initialValues: [alpha, beta]
			}
		);
		alpha = fittedParams.parameterValues[0];
		beta = fittedParams.parameterValues[1];
		error = fittedParams.parameterError;

		scalabilityLimit = findScalabilityLimit(alpha, beta, 128);
		if (scalabilityLimit > 7) {
			let newConcurrencies: number[] = [];
			const maxChartX = scalabilityLimit * 1.5;
			for (let i = 1; i <= maxChartX; i++) {
				newConcurrencies.push(i);
			}
			chartConcurrencies = newConcurrencies;
		}
	}

	$: options = {
		title: '',
		theme: isDark ? ChartTheme.G100 : ChartTheme.G10,
		axes: {
			left: {
				mapsTo: 'thoughput',
				title: 'Thoughput C(N)',
				scaleType: ScaleTypes.LINEAR,
				includeZero: false
			},
			bottom: {
				mapsTo: 'concurrency',
				title: 'Concurrency (N)',
				scaleType: ScaleTypes.LINEAR
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
		chartConcurrencies.map((concurrency) => {
			return {
				concurrency: concurrency,
				thoughput: usl(concurrency, uslElements[0].C, alpha, beta)
			};
		})
	) satisfies ChartTabularData;
</script>

<div class="space-y-4 flex flex-col">
	<div class="flex flex-col">
		{#each uslElements as elem, i}
			<div class="grid grid-cols-1 md:grid-cols-3 items-end gap-2">
				<div class="form-control">
					<label class="label" for={`concurrency-${i}`}>
						<span class="label-text">Concurrency (N)</span>
					</label>
					<input
						id={`concurrency-${i}`}
						type="number"
						bind:value={elem.N}
						on:change={(e) => {
							onNChange(e, i);
						}}
						min="0"
						placeholder="Enter the number of concurrency (N)"
						class="input input-bordered"
						disabled={i === 0}
					/>
				</div>

				<div class="form-control">
					<label class="label" for={`throughput-${i}`}>
						<span class="label-text">Throughput C({elem.N})</span>
					</label>
					<input
						id={`throughput-${i}`}
						type="number"
						bind:value={elem.C}
						min="0"
						placeholder="Enter the number of throughput C(N)"
						class="input input-bordered"
					/>
				</div>

				<button
					class="btn btn-square btn-outline btn-error place-self-end md:place-self-auto"
					on:click={() => {
						removeUSLElem(i);
					}}
					disabled={i === 0 || uslElements.length < 3}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/></svg
					>
				</button>
			</div>
		{/each}
	</div>
	<div class="flex flex-row gap-2">
		<button on:click={addUSLElem} class="btn btn-secondary">Add More</button>
		<button on:click={curveFitting} class="btn btn-primary">Calculate</button>
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
		<p>Estimate Alpha (α): {alpha}</p>
		<p>Estimate Beta (β): {beta}</p>
		<p>Error (Sum of squares): {error}</p>
		<p>
			Scalability Limit: C({scalabilityLimit})={usl(
				scalabilityLimit,
				uslElements[0].C,
				alpha,
				beta
			)}
		</p>
	</div>

	<LineChart {data} {options} />
</div>
