## Assumptions I made are:
	- City has a fixed boundary, out of which we do not serve.
	- Cabs have a maximum capacity of four.
	- Cab sharing is single person only. Two person sharing is not allowed
	- Cab will go to only the nearest commuter. As pickups of all commuters in a cab can be same

## What I am doing
	- When a user is to be allocated cab, we start by finding the nearby cabs.
	- When finding nearby cabs, we scan a small area surrounding the commuter.
	- If we find any cabs, we return them. Otherwise we search in a larger area.	
	- When we have the nearby cabs, we search for the nearest cab.
	- We allot the commuter to the nearest cab.
	- After allotments are done. We set the pickup points for each cab as the coordinates to nearest commuter.
	- Lastly print the total distances travelled by cabs.

For code look in pool.js
