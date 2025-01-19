---
categories:
  - network|네트워크
date: 2025-01-19T15:04:03+09:00
draft: false
tags:
  - network
title: "[Network] Routers"
---
## Overview

Isn't a switch enough in a LAN? Why do we need a router?  
Check this out to understand why -> [[Network] LAN with Hubs, Bridges, Switches](network-hub-bridges-switches)

In short, as the number of devices connected to a switch increases, speed and efficiency drop significantly 😵‍💫.  
To resolve this, we need to divide the network, and that's where the router comes in.

## Router

Placing a router splits a LAN into two segments.  
This brings the following benefits:
- The **broadcasting domain** is halved (broadcasting occurs within each segment).
- The switch only needs to maintain MAC address tables for its segment, reducing table size and improving efficiency.  
  ![](Screenshot%202025-01-19%20at%203.23.35%20PM.png)

Now, how does **Computer1** communicate with **Computer3**?  
It uses the concepts of **Network Interface** and **Default Gateway**.

### Network Interface
- A physical or virtual connection port that a router uses to communicate with different networks.
- A router can have multiple interfaces, each assigned an IP address.

For example, in the diagram above, the router has two network interfaces:
1. The interface connected to **Segment 1**
2. The interface connected to **Segment 2**  
   Each interface is assigned an IP address: 10.1.1.1 and 10.1.1.2, respectively.

> Additionally, since the router is also a device, it has its own unique MAC address and is connected to one of the switch’s ports.

### Default Gateway
The **default gateway** is the primary entry/exit point (i.e., the router) that a network device uses to send data **outside its own network**.

Returning to the original question:  
How does **Computer1** communicate with **Computer3** in the above diagram?

1. **Computer1** sets 10.1.2.13 as the target IP to send data to **Computer3**.
2. **Computer1** realizes, "Wait, 10.1.2.x isn’t in our LAN (Segment 1)."
3. **Computer1** determines the target is outside its network and decides to send the data to the router to handle it.
4. **Computer1** checks its default gateway address:
	1. The default gateway is the router's interface connected to Segment 1.
	2. In this case, it’s 10.1.1.1.
5. **Computer1** sends the data to the router.
6. The router identifies that 10.1.2.13 belongs to **Segment 2**.
7. The router forwards the data through its Segment 2 interface to the switch, which then delivers it to **Computer3**.

> Try running `route -n get default` to see the default gateway IP address.  
