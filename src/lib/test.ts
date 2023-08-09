import { factorial } from "./utils";

function erlangB(c: number, x: number): number {
	if (c === 0) return 1;
	let sum = 1.0;
	let numerator = 1.0;
	for (let i = 1; i <= c; i++) {
		numerator *= x;
		sum += numerator / factorial(i);
	}
	return 1.0 / sum;
}

function calculateGGsQueueMetrics(
	lambda: number,
	mu: number,
	s: number
): { L: number; W: number; Lq: number; Wq: number } {
	// Traffic Intensity (ρ)
	const rho = lambda / (mu * s);

	// Utilization factor (U)
	const U = rho * s;

	// Average number of customers in the system (L)
	const L = U !== 1 ? (U * erlangB(s, rho)) / (1 - U) : s / 2;

	// Average time a customer spends in the system (W)
	const W = L / lambda;

	// Average number of customers in the queue (Lq)
	const Lq = L - U;

	// Average time a customer spends waiting in the queue (Wq)
	const Wq = Lq / lambda;

	return { L, W, Lq, Wq };
}

function calculateMGSQueueMetrics(
	lambda: number,
	mu: number,
	s: number
): { L: number; W: number; Lq: number; Wq: number } {
	// Traffic Intensity (ρ)
	const rho = lambda / (mu * s);

	// Average number of customers in the system (L)
	const L = rho / (1 - rho);

	// Average time a customer spends in the system (W)
	const W = L / lambda;

	// Average number of customers in the queue (Lq)
	const Lq = (rho * rho) / (1 - rho);

	// Average time a customer spends waiting in the queue (Wq)
	const Wq = Lq / lambda;

	return { L, W, Lq, Wq };
}
