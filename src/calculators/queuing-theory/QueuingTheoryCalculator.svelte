<script lang="ts">
  import { ChartTheme } from "@carbon/charts";
  import {
    LineChart,
    ScaleTypes,
    type LineChartOptions,
  } from "@carbon/charts-svelte";
  import { darkModeAtom, getDarkMode } from "../../stores/darkModeStore";
  import { mmcProbabilityN, mmcQueueCalculation } from "./lib/mmc";
  import { md1ProbabilityN, md1QueueCalculation } from "./lib/md1";

  let isDark = getDarkMode();
  darkModeAtom.subscribe((darkMode) => {
    isDark = darkMode;
  });

  // input
  let model = "M/D/1"; //'M/M/c'; // selected model
  let lambda = 45; // arrival rate (λ)
  let mu = 60; // service rate (μ) (avg customers per servers)
  let c = 3; // number of servers
  let k = 12; // a maximum of K customers can be in the system
  let d = 0; // Deterministic service time (time units per customer)

  // output
  let error: string;
  let rho: number;
  let p0: number;
  let lq: number;
  let l: number;
  let wq: number;
  let w: number;
  let chartCustomers: { customer: number; probability: number }[] = [];

  function calculate() {
    error = "";
    switch (model) {
      case "M/M/c":
        if (lambda >= mu * c) {
          error =
            "Arrival rate (λ) must be less than Service rate (μ) * Number of servers (c)";
          break;
        }
        [rho, p0, lq, l, wq, w] = mmcQueueCalculation(lambda, mu, c);
        break;
      case "M/M/c/K":
        [rho, p0, lq, l, wq, w] = mmcQueueCalculation(lambda, mu, c, k);
        break;
      case "M/D/1":
        if (lambda >= mu) {
          error = "Arrival rate (λ) must be less than Service rate (μ)";
          break;
        }
        [rho, p0, lq, l, wq, w] = md1QueueCalculation(lambda, mu);
        break;
    }

    let newChartCustomers: { customer: number; probability: number }[] = [];
    let n = 0;
    let p = 0;
    let pn = -1;
    while (p < 0.999 && pn != 0) {
      switch (model) {
        case "M/M/c":
          pn = mmcProbabilityN(n, lambda, mu, c, p0);
          break;
        case "M/M/c/K":
          pn = mmcProbabilityN(n, lambda, mu, c, p0, k);
          break;
        case "M/D/1":
          pn = md1ProbabilityN(n, rho, p0);
          break;
      }
      p += pn;
      newChartCustomers.push({
        customer: n,
        probability: pn * 100,
      });
      n += 1;
    }

    switch (model) {
      case "M/M/c":
        pn = mmcProbabilityN(n, lambda, mu, c, p0);
        break;
      case "M/M/c/K":
        pn = mmcProbabilityN(n, lambda, mu, c, p0, k);
        break;
    }
    newChartCustomers.push({
      customer: n,
      probability: pn * 100,
    });

    chartCustomers = newChartCustomers;
  }
  calculate();

  $: options = {
    title: "",
    theme: isDark ? ChartTheme.G100 : ChartTheme.G10,
    axes: {
      left: {
        mapsTo: "probability",
        title: "Probability of n customers in queue (Pn)%",
        scaleType: ScaleTypes.LINEAR,
        includeZero: false,
      },
      bottom: {
        mapsTo: "customer",
        title: "Number of customers in queue (n)",
        scaleType: ScaleTypes.LINEAR,
        ticks: {
          formatter(tick, i) {
            if (typeof tick == "number" && tick % 1) {
              return "";
            }
            return tick.toString();
          },
        },
      },
    },
    height: "400px",
    legend: {
      enabled: false,
    },
    toolbar: {
      enabled: false,
    },
    tooltip: {
      groupLabel: "",
    },
  } satisfies LineChartOptions;
</script>

<div class="flex flex-col gap-4">
  {#if error}
    <div class="text-error">Error: {error}</div>
  {/if}
  <div class="flex justify-between items-center">
    <div>
      <span class="text-sm lg:text-lg">Select Model</span>
      <p class="text-xs lg:text-md text-gray-500">
        Select queuing theory model
      </p>
    </div>
    <select
      class="select select-bordered"
      bind:value={model}
      on:change={calculate}
    >
      <option value="M/M/c">M/M/c</option>
      <option value="M/M/c/K">M/M/c/K</option>
      <option value="M/D/1">M/D/1</option>
    </select>
  </div>
  <div class="flex justify-between items-center">
    <div>
      <span class="text-sm lg:text-lg">Arrival rate (λ)</span>
      <p class="text-xs lg:text-md text-gray-500">
        Average number of customers
      </p>
    </div>
    <input
      class="input input-bordered w-1/4"
      type="number"
      min="0"
      bind:value={lambda}
      on:change={calculate}
    />
  </div>
  <div class="flex justify-between items-center">
    <div>
      <span class="text-sm lg:text-lg">Service rate (μ)</span>
      <p class="text-xs lg:text-md text-gray-500">
        {#if model != "M/D/1"}
          Average customers that can be served per server
        {:else}
          Constant number of customers that can be served
        {/if}
      </p>
    </div>
    <input
      class="input input-bordered w-1/4"
      type="number"
      min={lambda}
      bind:value={mu}
      on:change={calculate}
    />
  </div>
  {#if model != "M/D/1"}
    <div class="flex justify-between items-center">
      <div>
        <span class="text-sm lg:text-lg">Number of servers (c)</span>
        <p class="text-xs lg:text-md text-gray-500">Number of servers</p>
      </div>
      <input
        class="input input-bordered w-1/4"
        type="number"
        min="0"
        bind:value={c}
        on:change={calculate}
      />
    </div>
  {/if}
  {#if model == "M/M/c/K"}
    <div class="flex justify-between items-center">
      <div>
        <span class="text-sm lg:text-lg">Maximum customers (K)</span>
        <p class="text-xs lg:text-md text-gray-500">
          Maximum customers can be in the system (queue and service)
        </p>
      </div>
      <input
        class="input input-bordered w-1/4"
        type="number"
        min="0"
        bind:value={k}
        on:change={calculate}
      />
    </div>
  {/if}
  <div class="divider" />
  <p>Traffic Intensity (ρ): {rho}</p>
  <p>Average Number of Customers (L): {l}</p>
  <p>Average Number of Customers in the Queue (Lq): {lq}</p>
  <p>Average Time a Customer Spends in the Service (W): {w}</p>
  <p>Average Time a Customer Spends in the Queue (Wq): {wq}</p>
  <p>
    Probability of no customers in the Queue (P0): {(p0 * 100).toFixed(3)}%
  </p>
  <p>Probability of <b>n</b> customers in the Queue (Pn):</p>
  <LineChart data={chartCustomers} {options} />
</div>
