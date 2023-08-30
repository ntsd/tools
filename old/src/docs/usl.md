<script>
	import { base } from '$app/paths';
</script>

The Universal Scalability Law (USL) is a model used to evaluate the performance of parallel
systems under increasing load, particularly when discussing computer servers or databases.

While <a class="link" href="{base}/amdahl-law">Amdahl's Law</a> states the theoretical maximum speedup
achievable due to parallel processing, the USL goes one step further and characterizes the behavior
of scalability in realistic systems, considering the overheads that arise when multiple tasks are
executed in parallel.
