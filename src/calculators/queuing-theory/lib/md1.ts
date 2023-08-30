import { factorial } from './utils';

// Traffic Intensity (ρ) return rho
const md1TrafficIntensity = (
	lambda: number, // arrival rate
	mu: number // service rate
) => {
	const rho = lambda / mu;
	return rho;
};

// probability of no customer in the queue (P0)
const md1ProbabilityOfNoCustomerInQueue = (rho: number): number => {
	return 1 - rho;
};

// Average number of customers in the queue (Lq) (M/D/1)
const md1AvgCustomersQueue = (
	rho: number // arrival rate
) => {
	return Math.pow(rho, 2) / (2 * (1 - rho));
};

// Average number of customers (L) (M/D/1)
const md1AvgCustomersInSystem = (
	lq: number, // Average number of customers in the queue (Lq)
	rho: number
) => {
	return lq + rho;
};

// Average time spent in the system (W)
const md1AvgTimeInSystem = (
	l: number, // Average number of customers (L)
	lambda: number // arrival rate
) => {
	return l / lambda;
};

// Average time spent in the queue (WQ)
const md1AvgTimeInQueue = (
	lq: number, // Average number of customers in the queue (Lq)
	lambda: number // arrival rate
) => {
	return lq / lambda;
};

// Probability of a queue with 'n' customers (Pn)
export const md1ProbabilityN = (
	n: number, // number of customers (n)
	rho: number, // rho
	p0: number // probability of no customer in the queue (P0)
): number => {
	if (n == 0) return p0;
	if (n == 1) return p0 * (Math.exp(rho) - 1);
	let sum = 0;
	for (let k = 1; k <= n; k++) {
		const kp = k * rho;
		sum +=
			(Math.pow(-1, n - k) * Math.exp(kp) * (kp + n - k) * Math.pow(kp, n - k - 1)) /
			factorial(n - k);
	}
	return sum * (1 - rho);
};

// calculate M/D/1 queue return [rho, p0, lq, l, wq, w]
export function md1QueueCalculation(
	lambda: number, // arrival rate
	mu: number // service rate
) {
	const rho = md1TrafficIntensity(lambda, mu);
	const p0 = md1ProbabilityOfNoCustomerInQueue(rho);

	let lq = 0;
	let l = 0;

	lq = md1AvgCustomersQueue(rho);
	l = md1AvgCustomersInSystem(lq, rho);

	const wq = md1AvgTimeInQueue(lq, lambda);
	const w = md1AvgTimeInSystem(l, lambda);

	return [rho, p0, lq, l, wq, w];
}
