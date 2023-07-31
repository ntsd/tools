<script lang="ts">
	import { ChartTheme } from '@carbon/charts';
	import { LineChart, ScaleTypes, type LineChartOptions } from '@carbon/charts-svelte';
	import darkModeStore, { getDarkMode } from '../stores/darkModeStore';
	import { mmsProbabilityN, mmsQueueCalculation } from '$lib/mms';

	let isDark = getDarkMode();
	darkModeStore.subscribe((darkMode) => {
		isDark = darkMode;
	});

	// input
	// let model = 'M/M/s'; // selected model
	let lambda = 60; // arrival rate (λ)
	let mu = 75; // service rate (μ) (customers per service)
	let s = 3; // number of service
	// let d = 0; // Deterministic service time (time units per customer)

	// output
	let rho: number;
	let p0: number;
	let lq: number;
	let l: number;
	let wq: number;
	let w: number;
	let chartCustomers: { customer: number; probability: number }[] = [];

	function calculateChartCustomers() {
		[rho, p0, lq, l, wq, w] = mmsQueueCalculation(lambda, mu, s);
		let newChartCustomers: { customer: number; probability: number }[] = [];
		let n = 0;
		let p = 0;
		while (p < 0.999) {
			const pn = mmsProbabilityN(n, lambda, mu, s, p0);
			p += pn;
			newChartCustomers.push({
				customer: n,
				probability: pn * 100
			});
			n += 1;
		}

		const pn = mmsProbabilityN(n, lambda, mu, s, p0);
		newChartCustomers.push({
			customer: n,
			probability: pn * 100
		});

		chartCustomers = newChartCustomers;
	}
	calculateChartCustomers();

	$: options = {
		title: '',
		theme: isDark ? ChartTheme.G100 : ChartTheme.G10,
		axes: {
			left: {
				mapsTo: 'probability',
				title: 'Probability of n Customers the Queue (Pn)%',
				scaleType: ScaleTypes.LINEAR,
				includeZero: false
			},
			bottom: {
				mapsTo: 'customer',
				title: 'Number of Customers (n)',
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
</script>

<!-- <div>
	<label>
		Select Model:
		<select bind:value={model} on:change={() => {}}>
			<option value="M/M/s">M/M/s</option>
			<option value="M/D/s">M/D/s</option>
			<option value="M/G/s">M/G/s</option>
			<option value="G/G/s">G/G/s</option>
		</select>
	</label>
</div> -->

<div class="flex flex-col gap-4">
	<div class="flex justify-between items-center">
		<div>
			<span class="text-sm lg:text-lg">Arrival rate (λ)</span>
			<p class="text-xs lg:text-md text-gray-500">The average number of customers </p>
		</div>
		<input
			class="input input-bordered w-1/4"
			id="p"
			type="number"
			min="0"
			bind:value={lambda}
			on:change={calculateChartCustomers}
		/>
	</div>
	<div class="flex justify-between items-center">
		<div>
			<span class="text-sm lg:text-lg">Service rate (μ)</span>
			<p class="text-xs lg:text-md text-gray-500">
				Maximum customers per service
			</p>
		</div>
		<input
			class="input input-bordered w-1/4"
			id="p"
			type="number"
			min={lambda}
			bind:value={mu}
			on:change={calculateChartCustomers}
		/>
	</div>
	<div class="flex justify-between items-center">
		<div>
			<span class="text-sm lg:text-lg">Number of services (s)</span>
			<p class="text-xs lg:text-md text-gray-500">Number of services</p>
		</div>
		<input
			class="input input-bordered w-1/4"
			id="p"
			type="number"
			min="0"
			bind:value={s}
			on:change={calculateChartCustomers}
		/>
	</div>
	<p>Traffic Intensity (ρ): {rho}</p>
	<p>Average Number of Customers (L): {l}</p>
	<p>Average Number of Customers in the Queue (Lq): {lq}</p>
	<p>Average Time a Customer Spends in the Service (W): {w}</p>
	<p>Average Time a Customer Spends in the Queue (Wq): {wq}</p>
	<p>
		Probability of no customers the Queue (P0): {(p0 * 100).toFixed(3)}%
	</p>
	<p>Probability of 'n' customers the Queue (Pn):</p>
	<LineChart data={chartCustomers} {options} />
</div>
