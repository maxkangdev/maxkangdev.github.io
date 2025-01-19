---
categories:
  - network|네트워크
date: 2025-01-19T21:32:20+09:00
draft: false
tags:
  - network
title: "[Network] VLAN"
---

## Overview

Let's assume that a company is divided into several departments.  
In this case, since each department has different tasks and network policies, LANs should be separated for each department.

### Physical Separation
In this case, we can simply separate them physically as shown below. Then, you can apply policies to the router to manage it.
![](Screenshot%202025-01-19%20at%209.21.36%20PM.png)

**However, this causes the following issues:**
- Every time a department increases, a new switch must be purchased.
- As the number of switches increases, the management area also increases.
	- You need to manage all the switches... so it's a hassle...

### Logical Separation
Just use one switch and manage them as if they were separate!  
![](Screenshot%202025-01-19%20at%209.26.05%20PM.png)

What makes this possible is VLAN, Virtual Local Area Network.

## VLAN (Virtual Local Area Network)
VLAN (Virtual Local Area Network) is a technology that logically separates one physical network into multiple networks, making it behave like several networks.

### Features
- **Port-based separation**
	- VLAN separates the network based on the switch's ports.
	- For example, if ports 1-10 are VLAN 10 and ports 2-20 are VLAN 20, devices in different VLANs cannot communicate with each other.
	- Communication is only possible through a router.
- **Frame tagging (802.1Q standard)**
	- To separate VLANs, VLAN IDs are added to the network frame using the **802.1Q tag** method.
	- Each frame is tagged with a VLAN ID (12 bits) to identify which VLAN the data belongs to.
	- Data without a VLAN tag is treated as "default VLAN."
### Configuration
- **Access Port**
	- A port that is statically connected to a specific VLAN.
	- Example: PCs and printers by department are configured to belong to specific VLANs.
	- Access ports support only one VLAN.
- **Trunk Port**
	- A port that transmits traffic for multiple VLANs.
	- Typically used for connections between switches or between a switch and a router.
	- Trunk ports transmit data containing VLAN information using the 802.1Q tagging method.
- **VLAN ID**
	- A number used to identify the VLAN, ranging from 1 to 4094 (typically, 1-1005 are standard VLANs, and 1006-4094 are extended VLANs).
	- VLAN 1 is the default VLAN, and data without a tag is treated as VLAN 1.

### Example
Using the diagram below as an example:
1. **Switch Port Configuration**
	- Ports 1-10: Access port, connected to VLAN 10.
	- Ports 11-20: Access port, connected to VLAN 20.
	- Ports 21-30: Access port, connected to VLAN 30.
	- Ports 31-40: Access port, connected to VLAN 40.
	- Port 41: Trunk port, connected to the router with VLAN tags.

![](Screenshot%202025-01-19%20at%209.31.48%20PM.png)
