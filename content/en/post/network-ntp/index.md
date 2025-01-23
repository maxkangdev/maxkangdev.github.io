---
categories:
  - network|네트워크
date: 2025-01-23T14:19:36+09:00
draft: false
tags:
  - network
title: "[Network] NTP"
---

## NTP (Network Time Protocol)
> A protocol for **synchronizing the time** of computers on a network. It ensures time accuracy and maintains consistency across multiple systems through time synchronization.

### Why is this necessary? 🤔

1. **Synchronization in Distributed Systems**
	- In systems where multiple servers and devices need to work together, inconsistencies in time can cause data discrepancies.  
	  Example: Timestamps in log files, distributed database transactions, etc.

2. **Security and Authentication**
	- Systems like Kerberos require accurate time. If the time is out of sync, authentication can fail. The same applies to certificates (e.g., expiration dates must be accurate).

3. **Troubleshooting**
	- Accurate timestamps are crucial for analyzing log files.  
	  Example: During server outages, if system times are not synchronized, identifying the root cause becomes challenging.

4. **Financial Transactions**
	- Stock trading and financial systems demand precise timing, often down to milliseconds.

5. **IoT and Network Devices**
	- IoT devices and network equipment rely on time synchronization for efficient data transmission and operation.

So, can we just fetch the time from an NTP server and use it? Simple, right? 😝
> Well... it's not that simple... 😅

## The Problem
> In network environments, issues like **latency** and **network asymmetry** exist.

### Network Latency
- The time it takes for data to travel between the client and the server.
	- For example, even if an NTP server sends the time as `12:00:00`, the client might receive it at `12:00:50`. Setting the time to `12:00:00` at that point introduces an error.

### Network Asymmetry
- The delay in the path from the client to the server (upstream) and from the server back to the client (downstream) can differ.
	- Client -> Server: 10ms
	- Server -> Client: 20ms
- In such cases, simply dividing the round-trip time (RTT) by 2 does not yield accurate time synchronization.

Thus, more detailed calculations are needed. 😩

## Principles

1. **NTP Request (Client -> Server)**
	- The client sends a message including `T1` (the time the request was sent) and asks, "What time is it?"

2. **Server Response (Server -> Client)**
	- The server includes:
		1. The time it received the request (`T2`).
		2. The time it sent the response (`T3`, the server's current time).
		3. Sends this information to the client, saying, "It's 12:00!"

3. **Client Reception**
	- The client records the time it received the response (`T4`).
	- Now, the client has four timestamps: `T1`, `T2`, `T3`, `T4`.

![Illustration](Screenshot%202025-01-23%20at%203.07.31%20PM.png)

### Calculations

**Round-Trip Delay Calculation**  
$$ Delay = (T4 − T1) − (T3 − T2) $$

**Offset Calculation**  
$$ Offset = \frac{(T2 - T1) + (T3 - T4)}{2} $$
- `T1`: The time the client sent the request.
- `T2`: The time the server received the request.
- `T3`: The time the server sent the response.
- `T4`: The time the client received the response.

## Example

### Time Information
- `T1 = 10:00:00.000`
- `T2 = 10:00:00.020`
- `T3 = 10:00:00.030`
- `T4 = 10:00:00.060`

**Delay Calculation**  
$$ Delay = 0.06 − 0.01 = 0.05 $$
- The round-trip network delay is **50ms**, which represents the network latency between the client and server.

**Offset Calculation**  
$$ Offset = \frac{0.02 + (-0.03)}{2} = -0.005 $$
- The client's clock is **5ms** slower.
- The client needs to advance its time by 5ms to synchronize with the server's clock.

### Synchronization
The client adjusts its time using the offset:  
$$ T4 + Offset = 10:00:00.060 − 0.005 = 10:00:00.055 $$

## Question

Why is the delay value unused?

Even after research, all sources say it's important... but I couldn’t find where it’s mathematically applied.  
If you know, please let me know in the comments.