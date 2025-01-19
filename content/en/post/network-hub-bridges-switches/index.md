---
categories:
  - network|네트워크
date: 2025-01-19T12:18:05+09:00
draft: false
tags:
  - network
title: "[Network] Hubs, Bridges, Switches in LAN"
---

## Hub
- A device that helps connect multiple devices.
- After receiving data, the hub forwards it to all devices connected to the network.

### Features
- Simplicity.
- Collisions occur when multiple devices transmit data simultaneously.
- Rarely used today as it has been replaced by advanced devices like switches or routers.  
  ![](Screenshot%202025-01-19%20at%2012.24.02%20PM.png)

## Bridge
- A device that connects two or more network segments (Hubs).
- Bridges divide a network into physically separated segments and control the flow of data between them.
- Commonly used in **LAN (Local Area Network)** to prevent unnecessary traffic from spreading across the network.

### Features
- **Filtering**
	- When receiving data, the bridge either forwards or blocks it based on the destination MAC address.
	- This **filtering** functionality ensures only necessary data is transmitted while blocking unnecessary data, improving network efficiency.

- **Collision Domain Separation**
	- Unlike hubs, bridges separate collision domains.
	- This allows independent management of collisions in each network segment, enhancing overall network performance.  
	  ![](Screenshot%202025-01-19%20at%2012.29.45%20PM.png)

## Switch
- Manages data communication between multiple devices and efficiently transmits data.
- A switch can be considered a **smart hub**. Unlike a hub, it sends data only to the specific device based on its **destination MAC address**.
- Widely used in **Ethernet networks**, playing a crucial role in LAN (Local Area Network).

### Features
- **Packet Transmission Efficiency**
	- Switches transmit data to the device with the corresponding MAC address after receiving it.
	- This reduces unnecessary traffic and improves network efficiency by sending data only to the intended device, functioning like **point-to-point** communication.

- **Collision Domain Separation**
	- Switches create separate **collision domains** for each port, reducing collisions within the network and enhancing performance.
	- Multiple devices can send data simultaneously without interference, allowing independent communication.

- **MAC Address Learning**
	- Switches use a **MAC address table** to learn the MAC addresses of network devices.
	- This enables them to identify which device is connected to each port and forward data only to the correct port.

### Switch vs Hub
- A **hub** sends data to all ports on the network, while a **switch** delivers data only to the destination port, improving network efficiency.
- In a hub, all devices share a single collision domain, potentially reducing performance. A switch, however, assigns independent collision domains to each port, enhancing performance.

## Broadcast Domain
- The range within which broadcast packets can be transmitted.
- Want to send data to all computers on the LAN? Just send a broadcast packet to the switch.
	- Therefore, **all devices connected to a switch = Broadcast Domain**.

### L2 Segment
- A network segment defined at the **Data Link Layer (Layer 2)**.
- Devices within an L2 segment communicate using **MAC addresses**.
- Thus, an L2 Segment is equivalent to a Broadcast Domain.

### Issues
- As more devices are added to the Broadcast Domain (L2 Segment), network performance deteriorates due to:
	- Increased broadcast traffic.
	- Performance degradation.
	- Expansion of collision domains.
	- Difficulty in network management.

### Solutions
- Network segmentation.
- VLAN.
- Router usage.

A separate post will cover these topics in detail. 🙂  

