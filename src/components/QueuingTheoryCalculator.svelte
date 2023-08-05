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
	let model = 'M/M/s/K'; // selected model
	let lambda = 45; // 60; // arrival rate (λ)
	let mu = 15; // 75; // service rate (μ) (avg customers per servers)
	let s = 3; // number of servers
	let k = 12; // a maximum of K customers can be in the system
	let d = 0; // Deterministic service time (time units per customer)

	// output
	let rho: number;
	let p0: number;
	let lq: number;
	let l: number;
	let wq: number;
	let w: number;
	let chartCustomers: { customer: number; probability: number }[] = [];

	function calculateChartCustomers() {
		switch (model) {
			case 'M/M/s':
				[rho, p0, lq, l, wq, w] = mmsQueueCalculation(lambda, mu, s);
				break;
			case 'M/M/s/K':
				[rho, p0, lq, l, wq, w] = mmsQueueCalculation(lambda, mu, s, k);
				break;
		}

		let newChartCustomers: { customer: number; probability: number }[] = [];
		let n = 0;
		let p = 0;
		let pn = -1;
		while (p < 0.999 && pn != 0) {
			switch (model) {
				case 'M/M/s':
					pn = mmsProbabilityN(n, lambda, mu, s, p0);
					break;
				case 'M/M/s/K':
					pn = mmsProbabilityN(n, lambda, mu, s, p0, k);
					break;
			}
			p += pn;
			newChartCustomers.push({
				customer: n,
				probability: pn * 100
			});
			n += 1;
		}

		switch (model) {
			case 'M/M/s':
				pn = mmsProbabilityN(n, lambda, mu, s, p0);
				break;
			case 'M/M/s/K':
				pn = mmsProbabilityN(n, lambda, mu, s, p0, k);
				break;
		}
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
				title: 'Probability of n customers in queue (Pn)%',
				scaleType: ScaleTypes.LINEAR,
				includeZero: false
			},
			bottom: {
				mapsTo: 'customer',
				title: 'Number of customers in queue (n)',
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

<div class="flex flex-col gap-4">
	<div class="flex justify-between items-center">
		<div>
			<span class="text-sm lg:text-lg">Select Model</span>
			<p class="text-xs lg:text-md text-gray-500">Select queuing theory model</p>
		</div>
		<select class="select select-bordered" bind:value={model} on:change={calculateChartCustomers}>
			<option value="M/M/s">M/M/s</option>
			<option value="M/M/s/K">M/M/s/K</option>
		</select>
	</div>
	<div class="flex justify-between items-center">
		<div>
			<span class="text-sm lg:text-lg">Arrival rate (λ)</span>
			<p class="text-xs lg:text-md text-gray-500">Average number of customers</p>
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
				Average customers that can be served per server
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
			<span class="text-sm lg:text-lg">Number of servers (s)</span>
			<p class="text-xs lg:text-md text-gray-500">Number of servers</p>
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
	{#if model == 'M/M/s/K'}
		<div class="flex justify-between items-center">
			<div>
				<span class="text-sm lg:text-lg">Maximum customers (K)</span>
				<p class="text-xs lg:text-md text-gray-500">Maximum customers can be in the system</p>
			</div>
			<input
				class="input input-bordered w-1/4"
				id="p"
				type="number"
				min="0"
				bind:value={k}
				on:change={calculateChartCustomers}
			/>
		</div>{/if}
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
