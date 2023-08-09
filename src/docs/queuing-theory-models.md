[Kendall's notation](https://en.wikipedia.org/wiki/Kendall%27s_notation) is a standardized way to describe and classify queuing models in the field of queuing theory.

The notation is written in the form A/S/c/K/N/D, where:

- A denotes the time distribution between arrivals to the queue. Common symbols include:
  - `M`: Markov or memoryless, i.e., exponential distribution or exponential time
  - `D`: Degenerate distribution, i.e., A deterministic or constant time
  - `G`: General distribution i.e., arbitrary distribution

- S denotes the time distribution of the service rate. It uses the same symbols as A (M, D, G).

- c denotes the number of servers in the system.

- K (optional) denotes the capacity of the system, i.e., the maximum number of customers that can be in the system at the same time (including both in queue and in service). If not specified, it's assumed to be infinite.

- N (optional) denotes the population size, i.e., the total number of potential customers. If not specified, it's assumed to be infinite.

- Z (optional) denotes the queue discipline, the order in which customers are served. FIFO is the most common one.
