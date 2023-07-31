// Average number of customers in the queue (Lq)
const mdsAvgCustomersQueue = (
	lambda: number, // arrival rate
	s: number, // number of service
	d: number // service time
) => {
	return ((s - 1) * d) / (s + lambda * d);
};

// Average number of customers (L)
const mdsAvgCustomersInSystem = (
	lambda: number, // arrival rate
	s: number, // number of service
	d: number // service time
) => {
	const lq = mdsAvgCustomersQueue(lambda, s, d);
	return lambda * lq;
};

// Average time spent in the system (W)
const mmsmdsAvgTimeInSystem = (
	lambda: number, // arrival rate
	mu: number, // service rate
	d: number // service time
) => {
	const L = mdsAvgCustomersInSystem(lambda, mu, d);
	return L / lambda;
};

// Average time spent in the queue (WQ)
const mdsAvgTimeInQueue = (
	lambda: number, // arrival rate
	mu: number, // service rate
	d: number // service time
) => {
	const Lq = mdsAvgCustomersQueue(lambda, mu, d);
	return Lq / lambda;
};
