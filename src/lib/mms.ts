function factorial(n: number): number {
	if (n === 0 || n === 1) return 1;
	return n * factorial(n - 1);
}

// Traffic Intensity (ρ)
const mmsTrafficIntensity = (
	lambda: number, // arrival rate
	mu: number, // service rate
	s: number // number of service
) => lambda / (s * mu);

// probability of no customer in the queue (P0)
const mmsProbabilityOfNoCustomerInQueue = (rho: number, s: number): number => {
	let sum = 0;
	for (let i = 0; i < s; i++) {
		// s * rho = lambda / mu
		sum += Math.pow(s * rho, i) / factorial(i);
	}
	sum += Math.pow(s * rho, s) / (factorial(s) * (1 - rho));
	return Math.pow(sum, -1);
};

// Average number of customers in the queue (Lq)
const mmsAvgCustomersQueue = (
	rho: number, // arrival rate
	alpha: number, // alpha
	p0: number, // probability of no customer in the queue (P0)
	s: number // number of service
) => {
	return (rho * Math.pow(alpha, s) * p0) / (factorial(s) * Math.pow(1 - rho, 2));
};

// Average number of customers (L)
const mmsAvgCustomersInSystem = (
	lq: number, // Average number of customers in the queue (Lq)
	alpha: number // alpha
) => {
	return alpha + lq;
};

// Average time spent in the system (W)
const mmsAvgTimeInSystem = (
	l: number, // Average number of customers (L)
	lambda: number // arrival rate
) => {
	return l / lambda;
};

// Average time spent in the queue (WQ)
const mmsAvgTimeInQueue = (
	lq: number, // Average number of customers in the queue (Lq)
	lambda: number // arrival rate
) => {
	return lq / lambda;
};

// Probability of a queue with 'n' customers (Pn)
export const mmsProbabilityN = (
	n: number, // number of customers (n)
	lambda: number, // arrival rate
	mu: number, // service rate
	s: number, // number of service
	p0: number // probability of no customer in the queue (P0)
) => {
	if (n <= s) {
		return (Math.pow(lambda, n) / (factorial(n) * Math.pow(mu, n))) * p0;
	}
	return (Math.pow(lambda, n) / (Math.pow(s, n - s) * factorial(s) * Math.pow(mu, n))) * p0;
};

// calculate M/M/s queue return [rho, p0, lq, l, wq, w]
export function mmsQueueCalculation(
	lambda: number, // arrival rate
	mu: number, // service rate
	s: number // number of service
) {
	const rho = mmsTrafficIntensity(lambda, mu, s);
	const p0 = mmsProbabilityOfNoCustomerInQueue(rho, s);

	const alpha = lambda / mu;
	const lq = mmsAvgCustomersQueue(rho, alpha, p0, s);
	const l = mmsAvgCustomersInSystem(lq, alpha);

	const wq = mmsAvgTimeInQueue(lq, lambda);
	const w = mmsAvgTimeInSystem(l, lambda);

	return [rho, p0, lq, l, wq, w];
}
