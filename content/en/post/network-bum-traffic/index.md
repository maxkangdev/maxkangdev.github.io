---
categories:
  - network|네트워크
date: 2025-01-19T14:34:27+09:00
draft: false
tags:
  - network
title: "[Network] BUM Traffic - Broadcast, Unknown Unicast, and Multicast"
---

## BUM, stands for
- Broadcast
- Unknown unicast
- Multicast

## Broadcast
A method of transmitting data to **all devices** on the network simultaneously.

Let’s explore this with an example -> ARP
### ARP, Address Resolution Protocol
`Broadcast` used to find the Mac Address associated with an IP.

Consider the scenario where Computer1 wants to communicate with Computer2.  
If Computer1 knows the IP of Computer2 but not its Mac Address, what can it do?

In a LAN, communication is based on the Mac Address, so without knowing it, communication is impossible... 🧐  
![](Screenshot%202025-01-19%20at%202.38.20%20PM.png)

Here’s how ARP helps:
1. Computer1 broadcasts an ARP Request.
2. The switch receives the request and sends it to all devices in the LAN (since it’s a broadcast).
	- "Hey... whose IP is this? Come forward! 😤"
3. The owner of the IP (Computer2) replies with an ARP Response containing its Mac Address.
4. Computer1 updates its internal ARP table with this information.
5. Computer1 can now use the Mac Address to send Unicast messages. 🙂

> Try `arp -a` to see ARP table info

## Unknown Unicast
A packet transmission method that occurs when the recipient is **unknown**.

Let’s understand this with an example.
### When two or more switches are connected
Sometimes switches are connected in a network (aka switch link or daisy chaining).

Now imagine Computer1 wants to send data to Computer3.

Switch1:
- "Hmm... I don’t know Mac3. 😓" ← This is an Unknown Unicast.

![](Screenshot%202025-01-19%20at%202.54.25%20PM.png)

Here’s how it gets resolved:
1. Switch1 forwards the request to all its ports.
2. The request reaches Computer3 via Switch2, and Computer3 responds.
3. Switch1 learns which port connects to Computer3 via Switch2.
4. Switch1 updates its Mac Table accordingly.

## Multicast
A method of transmitting data to a **specific group of recipients** (1 to many).

For example, when Computer1 sends data only to Computer3 and Computer4, this is called Multicast.  
