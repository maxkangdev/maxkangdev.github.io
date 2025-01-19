---
categories:
  - network|네트워크
date: 2025-01-19T12:50:28+09:00
draft: false
tags:
  - network
title: "[Network] OSI Model"
---

## OSI Model

- A model that divides the communication process in computer networks into seven layers.
- This theoretical structure is useful for understanding network communication and diagnosing issues, with each layer handling specific functions within the network.
- Used to explain how network protocols and devices interact.

### Summary Table

| Layer Number | Layer Name                     | Function                                | Transmission Unit | Example Protocols        |  
|--------------|--------------------------------|----------------------------------------|-------------------|--------------------------|  
| 7            | Application Layer             | Direct interaction with users, providing application services | Message           | HTTP, FTP, SMTP          |  
| 6            | Presentation Layer            | Data format conversion, compression, encryption, encoding/decoding | Message           | JPEG, GIF, SSL, TLS      |  
| 5            | Session Layer                 | Establishing, managing, and terminating communication sessions | Message           | NetBIOS, RPC             |  
| 4            | Transport Layer               | Ensures data reliability, flow control, error correction     | Segment           | TCP, UDP                 |  
| 3            | Network Layer                 | Data routing, IP address management, packet transmission     | Packet            | IP, ICMP, IPX            |  
| 2            | Data Link Layer               | Frame transmission, error detection and correction, MAC address management | Frame | Ethernet, PPP, Switch   |  
| 1            | Physical Layer                | Bit transmission over physical media, electrical/optical signal transmission | Bit | Cables, Repeaters, Hubs  |  

> Remember "All People Seem To Need Data Processing" for the layer order from 7 to 1. 😄

### 7. **Application Layer**
- **Function**
	- The layer that directly interacts with users.
	- Provides services for applications to transmit data over the network.
	- Includes protocols such as HTTP, FTP, and SMTP.
- **Example Devices**: None (software layer)
- **Transmission Unit**: Message

### 6. **Presentation Layer**
- **Function**
	- Converts the data representation format.
	- Handles compression, encryption, encoding/decoding.
	- Ensures the data format is suitable for the application layer.
- **Example Devices**: None (software layer)
- **Transmission Unit**: Message

### 5. **Session Layer**
- **Function**
	- Establishes, manages, and terminates communication sessions.
	- Maintains sessions to ensure uninterrupted communication and manages data exchange between multiple applications.
- **Example Devices**: None (software layer)
- **Transmission Unit**: Message

### 4. **Transport Layer**
- **Function**
	- Ensures data reliability, flow control, and error correction.
	- Transmits data as **segments** via ports on the sender and receiver sides, ensuring data sequence and accuracy.
- **Example Devices**: None (software layer)
- **Transmission Unit**: Segment (TCP) / Datagram (UDP)

### 3. **Network Layer**
- **Function**
	- Selects routes for data delivery and handles packet routing.
	- Establishes connections between networks and facilitates communication using **IP addresses**.
- **Example Devices**: Routers
- **Transmission Unit**: Packet

### 2. **Data Link Layer**
- **Function**
	- Corrects transmission errors and stabilizes data transfer.
	- Transfers data frames between network devices and uses **MAC addresses** for device communication.
- **Example Devices**: Switches, Bridges
- **Transmission Unit**: Frame

### 1. **Physical Layer**
- **Function**
	- Provides the physical medium for data transmission.
	- Transmits bits (0s and 1s) using electrical signals, optical signals, or radio waves.
- **Example Devices**: Cables, Hubs, Repeaters, Network Interface Cards (NIC), Switch Ports
- **Transmission Unit**: Bit  


