<script>
	import { base } from '$app/paths';
</script>

`C(N) = N / (1 + α(N-1) + βN(N-1))`

Where:

- `C(N)` is the relative capacity of a system (which can be performance or throughput) as a function of the number of processing elements N.
  
- `α` is the contention parameter (which represents serialized or linear component of the workload).
  
- `β` is the coherency factor (which measures the influences from the overhead introduced by crosstalk between parallel executing tasks).

Key takeaways from USL:

1. USL accounts for two primary facets that impede scalability: serialization (from Amdahl's Law) and crosstalk or coordination penalty (the overhead introduced when tasks communicate with each other).
2. Unlike <a class="link" href="{base}/amdahl-law">Amdahl's Law</a>, which gives an optimistic representation, USL provides a more realistic picture of scalability by incorporating these penalties of parallel processing.
3. USL is useful for modeling, predicting, and understanding the performance scalability of systems, which can help guide decisions about system design and capacity planning.