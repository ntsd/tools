# ref https://classes.cs.uchicago.edu/archive/2019/fall/30121-1/lecture-examples/M-D-1_Queues.html

from queue import Queue
import random


# A class to represent a single customer in an M/D/1 queue simulation.
# Each customer has three attributes:
#
#  - cid: A customer identifier (can be anything, but we will use consecutive integers)
#  - arrival_time: The time at which the customer arrived at the queue
#  - departure_time: The time at which the customer departed the queue
class Customer(object):
    def __init__(self, cid, arrival_time):
        self.cid = cid
        self.arrival_time = arrival_time
        self.departure_time = None
        
    def get_wait(self):
        if self.departure_time is None:
            return None
        else:
            return self.departure_time - self.arrival_time
        
    def __str__(self):
        return "Customer({}, {})".format(self.cid, self.arrival_time)
    
    def __repr__(self):
        return str(self)

# simulate_md1: Simulates an M/D/1 queue.
#
# In an M/D/1 queue que have:
#   
# - Arrivals follow a Markov process (M)
# - The time to service each customer is deterministic (D)
# - There is only one server (1)
#
# The function takes three parameters (plus one optional parameter)
#
# - lambd: The simulation uses an exponential distribution to determine
#          the arrival time of the next customer. This parameters is the
#          lambda parameter to an exponential distribution (specifically,
#          Python's random.expovariate)
# - mu: The rate at which customers are serviced. The larger this value is,
#       the more customers will be serviced per unit of time
# - max_time: The maximum time of the simulation
# - verbosity (optional): Can be 0 (no output), 1 (print state of the queue
#                         at each time), or 2 (same as 1, but also print when
#                         each customer arrives and departs)
#
# The function returns two lists: one with all the customers that were served
# during the simulation, and one with all the customers that were yet to be
# served when the simulation ended.
#
def simulate_md1(lambd, mu, max_time, verbosity = 0):
    md1 = Queue()

    # Our return values: the list of customers that have been
    # served, and the list of customers that haven't been served
    served_customers = []
    unserved_customers = []
    
    # The type of simulation we have implemented in this function
    # is known as a "discrete event simulation"
    # (https://en.wikipedia.org/wiki/Discrete_event_simulation), where
    # we simulate a discrete sequence of events: customer arrivals
    # and customer departures. So, we only need to keep track of when 
    # the next arrival and the next departure will take place (because 
    # nothing interesting happens between those two types of events). 
    # Then, in each step of the simulation, we simply advance the 
    # simulation clock to earliest next event. Note that, because
    # we have a single server, this can be easily done with just
    # two variables.

    next_arrival = random.expovariate(lambd)
    next_service = next_arrival + 1/mu
        
    # We initialize the simulation's time to the earliest event:
    # the next arrival time
    t = next_arrival
    
    # We will number customers starting from 1
    cid = 1
    
    while t < max_time:

        # Process a new arrival
        if t == next_arrival:
            customer = Customer(cid, arrival_time = t)
            cid += 1
            md1.put(customer)

            if verbosity >= 2:
                print("{:10.2f}: Customer {} arrives".format(t, customer.cid))

            next_arrival = t + random.expovariate(lambd)
            
        # The customer at the head of the queue has been served
        if t == next_service:
            done_customer = md1.get()
            done_customer.departure_time = t
            
            served_customers.append(done_customer)

            if verbosity >= 2:
                print("{:10.2f}: Customer {} departs".format(t, done_customer.cid))            
            
            if md1.empty():
                # The next service time will be 1/mu after the next arrival
                next_service = next_arrival + 1/mu
            else:
                # We start serving the next customer, so the next service time
                # will be 1/mu after the current time.
                next_service = t + 1/mu
            
        if verbosity >= 1:
            print("{:10.2f}: {}".format(t, "#"*md1.length))
            
        # Advance the simulation clock to the next event
        t = min(next_arrival, next_service)
        
    # Any remaining customers in the queue haven't been served
    while not md1.empty():
        unserved_customers.append(md1.get())
        
    return served_customers, unserved_customers

served_customers, unserved_customers = simulate_md1(1, 3, 10, verbosity=0)
print('served_customers', served_customers)
print('unserved_customers', unserved_customers)
