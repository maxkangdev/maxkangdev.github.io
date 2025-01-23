---
categories:
  - network|네트워크
date: 2025-01-23T15:37:45+09:00
draft: false
tags:
  - network
title: "[Network] NAT"
---
## Background Knowledge
IP addresses are categorized into Public IP Addresses and Private IP Addresses.

The following Private IP Address ranges are not globally unique and should only be used within internal networks:
- 10.0.0.0 - 10.255.255.255
- 172.16.0.0 - 172.31.255.255
- 192.168.0.0 - 192.168.255.255

Only addresses outside these ranges can be used as globally unique Public IP Addresses.

So, how do devices using these Private IP addresses access the internet? -> **NAT**

## NAT (Network Address Translation)
> A technique for translating IP addresses within a network. It enables multiple internal devices to access the internet using a single Public IP Address.

### Key Functions
1. **IP Address Conservation**
	- Multiple devices in an internal network can share a single Public IP Address to connect to the internet, saving Public IP Addresses.

2. **Security**
	- NAT hides the structure of the internal network, making it harder for external entities to directly access it, providing security benefits.

3. **Internet Access Management**
	- NAT manages connections to the internet and can route traffic back to the internal network based on specific port numbers.

### How Are Internal IPs Differentiated?
This is achieved using **Port Address Translation (PAT)**:

1. **When Internal Devices Access the Internet**:
	- When devices in the internal network send requests to the internet, each request is accompanied by an internal IP address and port number.
	- The NAT device assigns a **Public IP address and a unique port number** to each request.
	- Example: Traffic from internal IP `192.168.1.2` on port `12345` is translated to Public IP `203.0.113.1` on port `10001`.

2. **When Responses Are Received**:
	- Incoming responses from the internet are directed to the Public IP address `203.0.113.1` and port `10001`.
	- The NAT device determines which internal device the response should be routed to by referencing the **port number** in the mapping.
	- Example: A response directed to `203.0.113.1:10001` is identified as belonging to the request from internal IP `192.168.1.2` on port `12345` and is forwarded to the corresponding device in the internal network.