function factorial(n: number): number {
	if (n === 0 || n === 1) return 1;
	return n * factorial(n - 1);
}

// Traffic Intensity (ρ) return [tau, rho]
const mmsTrafficIntensity = (
	lambda: number, // arrival rate
	mu: number, // service rate
	s: number // number of servers
) => {
	const tau = lambda / mu;
	const rho = tau / s; // or lambda / (mu * s)
	return [tau, rho];
};

// probability of no customer in the queue (P0)
const mmsProbabilityOfNoCustomerInQueue = (
	tau: number, // tau (lambda/mu)
	rho: number,
	s: number,
	k?: number
): number => {
	let sum = 0;

	// tau (lambda / mu) = s * rho
	for (let i = 0; i < s; i++) {
		sum += Math.pow(tau, i) / factorial(i);
	}

	// if it has maximum number of customers (M/M/s/K)
	if (k) {
		let x = Math.pow(tau, s) / factorial(s);
		if (rho == 1) {
			x *= k - s + 1;
		} else {
			x *= (1 - Math.pow(tau, k - s + 1)) / (1 - rho);
		}
		sum += x;
	} else {
		sum += Math.pow(tau, s) / (factorial(s) * (1 - rho));
	}

	return Math.pow(sum, -1); // 1 - sum
};

// Average number of customers in the queue (Lq) (M/M/s)
const mmsAvgCustomersQueue = (
	tau: number, // tau (lambda / mu)
	rho: number, // arrival rate
	p0: number, // probability of no customer in the queue (P0)
	s: number // number of servers
) => {
	return (rho * Math.pow(tau, s) * p0) / (factorial(s) * Math.pow(1 - rho, 2));
};

// Average number of customers in the queue (Lq) (M/M/s/K)
const mmskAvgCustomersQueue = (
	tau: number, // tau (lambda / mu)
	rho: number, // arrival rate
	p0: number, // probability of no customer in the queue (P0)
	s: number, // number of servers
	k: number
) => {
	let x = (p0 * Math.pow(tau, s)) / factorial(s);
	if (rho == 1) {
		x *= ((k - s) * (k - s + 1)) / 2;
	} else {
		x *=
			(rho * (1 - Math.pow(rho, k - s + 1) - (k - s + 1) * Math.pow(rho, k - s) * (1 - rho))) /
			Math.pow(1 - rho, 2);
	}
	return x;
};

// Average number of customers (L) (M/M/s)
const mmsAvgCustomersInSystem = (
	lq: number, // Average number of customers in the queue (Lq)
	tau: number // tau
) => {
	return lq + tau;
};

// Average number of customers (L) (M/M/s/K)
const mmskAvgCustomersInSystem = (
	lq: number, // Average number of customers in the queue (Lq)
	tau: number, // tau
	offset: number
) => {
	return lq + tau * offset;
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
	s: number, // number of servers
	p0: number, // probability of no customer in the queue (P0)
	k?: number // maximum number of customers in system
) => {
	if (k && n > k) {
		return 0;
	}
	if (n <= s) {
		return (Math.pow(lambda, n) / (factorial(n) * Math.pow(mu, n))) * p0;
	}
	return (Math.pow(lambda, n) / (Math.pow(s, n - s) * factorial(s) * Math.pow(mu, n))) * p0;
};

// calculate M/M/s queue return [rho, p0, lq, l, wq, w]
export function mmsQueueCalculation(
	lambda: number, // arrival rate
	mu: number, // service rate
	s: number, // number of servers
	k?: number // maximum number of customers in system
) {
	const [tau, rho] = mmsTrafficIntensity(lambda, mu, s);
	const p0 = mmsProbabilityOfNoCustomerInQueue(tau, rho, s, k);

	let lq = 0;
	let l = 0;

	if (k) {
		const offset = 1 - mmsProbabilityN(k, lambda, mu, s, p0, k);

		lq = mmskAvgCustomersQueue(tau, rho, p0, s, k);
		l = mmskAvgCustomersInSystem(lq, tau, offset);

		// lambda-bar (λ-bar)
		lambda *= offset;
	} else {
		lq = mmsAvgCustomersQueue(tau, rho, p0, s);
		l = mmsAvgCustomersInSystem(lq, tau);
	}

	const wq = mmsAvgTimeInQueue(lq, lambda);
	const w = mmsAvgTimeInSystem(l, lambda);

	return [rho, p0, lq, l, wq, w];
}
