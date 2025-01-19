---
categories:
  - network|네트워크
date: 2025-01-19T12:17:00+09:00
draft: false
tags:
  - network
title: "[Network] Mac Address in LAN"
---

## Overview
Due to a lack of network knowledge, I often spend extra time on the networking part during development.  
This is the perfect opportunity to thoroughly organize and clarify my understanding of networking 🤓.

## LAN (Local Area Network)
- Refers to a network connecting computers and other devices within a relatively limited area.
- Typically used in small spaces like homes, offices, or schools.
- Designed to efficiently handle data transfer between devices.

### Components
- **Network Devices**
	- **Switch**: Connects multiple devices into a single LAN.
	- **Router**: Connects the LAN to external networks (like the internet).
	- **Access Point (AP)**: A device for wireless LAN (WLAN).
- **Network Cables**
	- Ethernet cables are used in wired LANs.
- **Network Adapters**
	- Each device needs a Network Interface Card (NIC) to connect to the LAN.

> Each computer has an NIC, which looks like this:  
![](Screenshot%202025-01-19%20at%2011.44.57%20AM.png)

### Types
- **Wired LAN**:
	- Devices are physically connected using Ethernet cables.
	- Provides stable and fast performance.
- **Wireless LAN (WLAN)**:
	- Connects devices wirelessly via Wi-Fi.
	- Offers mobility and convenience.

## MAC Address (Media Access Control Address)
Used to identify devices physically within a network.

### Structure
- Typically **48 bits (6 bytes)** long and represented in hexadecimal format.
	- Commonly displayed as a 12-character hexadecimal string, separated by **colons (:)** or **hyphens (-)**.
	- The first 3 bytes are a unique identifier for the device manufacturer.
		- For example, `00:14:22` indicates a specific manufacturer.
	- The remaining 3 bytes are uniquely assigned to each device, ensuring that every device has a unique MAC address.
	- Example: `00:14:22:01:23:45` or `00-14-22-01-23-45`.

### Uses
- **Device Identification**
	- Each NIC port is assigned a unique MAC address.
	- The MAC address uniquely identifies a device on the network.

- **Packet Delivery**
	- Used at the data link layer to deliver packets to the destination device.
	- Ensures that data is sent to the correct device during communication.

- **Network Security**
	- Some security systems restrict device access based on MAC addresses or use MAC address filtering to control which devices can connect to the network.

- **DHCP Allocation**
	- When using **DHCP (Dynamic Host Configuration Protocol)**, MAC addresses help dynamically allocate IP addresses to devices.

### MAC vs. IP
- **MAC Address**: A hardware address unique to each network device, unchanging regardless of the internet connection.
- **IP Address**: A logical address that identifies devices on a network, dynamically changing depending on the network environment.
> Therefore, **MAC addresses** distinguish devices within local networks, while **IP addresses** distinguish devices on the internet.

### So, do laptops not have a MAC address since they don’t have ports?
Nope. NICs aren’t just for Ethernet; laptops have NICs for Wi-Fi, Bluetooth, and more, meaning they also have MAC addresses.

## Communication within a LAN
Within a LAN, communication relies on MAC addresses to send and receive data.  
![](Screenshot%202025-01-19%20at%2012.09.03%20PM.png)  





