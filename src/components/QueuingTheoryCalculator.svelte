<script lang="ts">
	import { ChartTheme } from '@carbon/charts';
	import { LineChart, ScaleTypes, type LineChartOptions } from '@carbon/charts-svelte';
	import darkModeStore, { getDarkMode } from '../stores/darkModeStore';
	import { mmcProbabilityN, mmcQueueCalculation } from '$lib/mmc';

	let isDark = getDarkMode();
	darkModeStore.subscribe((darkMode) => {
		isDark = darkMode;
	});

	// input
	let model = 'M/M/c'; // selected model
	let lambda = 60; // arrival rate (λ)
	let mu = 45; // service rate (μ) (avg customers per servers)
	let c = 3; // number of servers
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
			case 'M/M/c':
				[rho, p0, lq, l, wq, w] = mmcQueueCalculation(lambda, mu, c);
				break;
			case 'M/M/c/K':
				[rho, p0, lq, l, wq, w] = mmcQueueCalculation(lambda, mu, c, k);
				break;
		}

		let newChartCustomers: { customer: number; probability: number }[] = [];
		let n = 0;
		let p = 0;
		let pn = -1;
		while (p < 0.999 && pn != 0) {
			switch (model) {
				case 'M/M/c':
					pn = mmcProbabilityN(n, lambda, mu, c, p0);
					break;
				case 'M/M/c/K':
					pn = mmcProbabilityN(n, lambda, mu, c, p0, k);
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
			case 'M/M/c':
				pn = mmcProbabilityN(n, lambda, mu, c, p0);
				break;
			case 'M/M/c/K':
				pn = mmcProbabilityN(n, lambda, mu, c, p0, k);
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
				scaleType: ScaleTypes.LINEAR,
				ticks: {
					formatter(tick, i) {
						if (tick % 1) {
							return '';
						}
						return tick.toString();
					}
				}
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
			<option value="M/M/c">M/M/c</option>
			<option value="M/M/c/K">M/M/c/K</option>
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
			<span class="text-sm lg:text-lg">Number of servers (c)</span>
			<p class="text-xs lg:text-md text-gray-500">Number of servers</p>
		</div>
		<input
			class="input input-bordered w-1/4"
			id="p"
			type="number"
			min="0"
			bind:value={c}
			on:change={calculateChartCustomers}
		/>
	</div>
	{#if model == 'M/M/c/K'}
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
		Probability of no customers in the Queue (P0): {(p0 * 100).toFixed(3)}%
	</p>
	<p>Probability of 'n' customers in the Queue (Pn):</p>
	<LineChart data={chartCustomers} {options} />
</div>
