---
categories:
  - network|네트워크
date: 2025-01-23T09:34:43+09:00
draft: true
tags:
  - network
title: "[Network] WAN, VPN"
---
## WAN (Wide Area Network)

A Wide Area Network refers to a network that spans a large geographic area.
- Typically connects multiple LANs.
- Enables communication between branch offices, cities, countries, and even continents.

### Characteristics
- Public or private networks
	- Utilizes public communication networks (such as the internet) or leased lines to form the network.
- Communication media
	- Utilizes technologies such as fiber optics, satellite links, and MPLS.
- Distributed ownership
	- Often consists of infrastructure owned by multiple organizations or service providers.

### Examples
- The internet
- Corporate networks
	- Networks used by large corporations to connect branch offices worldwide.
- Telecommunication networks
	- Networks that support internet and phone services provided by telecommunications companies.

### Advantages and Disadvantages

|                                            Advantages                                            |                                                       Disadvantages                                                       |
| :-------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------: |
| - Enables global connectivity and communication.<br>- Allows sharing of resources and information over long distances.<br>- Enables centralized data management for multinational companies. | - Relatively high setup and maintenance costs.<br>- Latency and reliability issues due to long-distance communication or shared infrastructure.<br>- Requires stronger security during data transfer. |

Hmm... then how is the internet connected? 😓

## Internet Connection

![](Screenshot%202025-01-23%20at%209.55.44%20AM.png)

First, let's understand the roles of each component.
(If you read the [[Network]Router](network-router) post from here, you'll get the basic idea.)

### ISP (Internet Service Provider)
- A company that provides internet connectivity.
- Connects the networks of homes or businesses to the global internet (e.g., KT, SK Broadband, LG U+).

### Border Router
- A device that connects an internal network to the ISP’s network.
- Main roles:
	- Manages data transmission between the internal network and the internet.
	- Enhances security with features such as NAT (Network Address Translation) or firewalls.

### **Ethernet Switch (the orange switch near the border router)**
- A switch that receives data from the border router and forwards it to the internal network.
- The switch checks the destination of the data (based on MAC addresses) and sends it to the correct device.
- Acts as the hub that divides the network into sub-networks.

### Why do we need two routers?
- **First router (Border Router)** 👉 connects the **outside** (internet) to the **inside** (local network).
	- Connects the ISP to the internal network.
	- This router handles external internet traffic and links external IP addresses with internal devices via NAT.
- **Second router (Internal Router)** 👉 handles **data transfer between internal networks**.
	- Connects different sub-networks within the internal network (e.g., separate networks for different floors or departments).
	- Manages the data flow between the networks within an organization.
#### Summary:
- Border Router: Connects **external** (internet) ↔ **internal** (local network).
- Internal Router: Connects **internal network** ↔ **internal network**.

### Why are there two switches?
- **First switch (orange)**:
	- Connects the border router to the internal router.
	- Acts as the "backbone" that forwards data from the internet to the internal router.
	- Essential in large-scale networks.
- **Second switches (blue)**:
	- Connects the internal router to multiple computers.
	- Expands the network by connecting multiple devices.
	- In large networks, placing devices physically close to a switch improves data transfer speed and efficiency.
#### Summary:
- **First switch**: Connects **external** (border router) to **internal** (internal router).
- **Second switches**: Connects **internal router** to multiple computers.

## VPN (Virtual Private Network)
Isn’t WAN enough? What is a VPN, and why is it needed?

### Issues with WAN
- **For WANs not using the internet**:
	- WANs using dedicated lines (MLPS, dedicated fiber optic lines) require physical infrastructure.
		- Expensive to build and maintain.
		- Costs increase exponentially as the network grows.
		- Infrastructure, maintenance, equipment, and software costs add up.
	- Ultimately, it becomes an expensive endeavor.
- **For WANs using the internet**:
	- Higher installation and operational costs.
	- But, it’s slow...
	- Security is also a concern...

This is where **VPN** comes in.

### Purpose
- Provides a **secure** connection over a public network (internet).
- Used for public Wi-Fi, data encryption, hiding IP addresses, or bypassing geo-restricted content.

## IPSEC VPN

**IPsec VPN** uses the **IP Security (IPsec)** protocol to transmit data securely over public networks like the internet.

### How It Works
IPsec VPN operates in two modes: **Tunnel Mode** and **Transport Mode**.
- **Tunnel Mode**:
	- The most commonly used mode where IPsec encrypts the **entire packet** and encapsulates the encrypted packet with a new header.
	- Typically used for connecting **two networks** (e.g., remote workers to company networks).
- **Transport Mode**:
	- Only encrypts the **data** portion, leaving the IP header unchanged.
	- Commonly used for secure communication between **two hosts**.

| Item                | **Tunnel Mode**                              | **Transport Mode**                             |
| ------------------ | -------------------------------------------- | --------------------------------------------- |
| **Encryption Scope** | Entire packet (header + data)                | Only data (header remains unchanged)          |
| **Header Change**    | New IP header added (packet encapsulation)   | Uses existing IP header                       |
| **Use Case**         | Connecting two networks (e.g., remote workers to company networks) | Secure communication between two hosts (e.g., server-to-server data transfer) |
| **Security**         | Higher security (encrypts the entire packet to protect all information) | Relatively lower security (header is not encrypted) |
| **Main Examples**    | Site-to-site VPN, remote worker connection  | Server-to-server communication, end-to-end secure connections |
| **Packet Size**      | Packet size may increase due to additional header | Packet size remains relatively unchanged      |
| **Performance**      | May experience performance degradation due to encryption and encapsulation | Relatively less performance degradation due to limited encryption scope |

> The header contains destination addresses, source addresses, routing information, etc. Encrypting this part allows for location tracking prevention, anonymity protection, packet analysis prevention, and defense against man-in-the-middle attacks, which can be considered as "tunneling."

## Layer 2 VPN
A **Layer 2 VPN** operates at the **Data Link Layer** (Layer 2) of the OSI model.

In other words, a Layer 2 VPN connects multiple sites (servers, locations, etc.) over physical networks as if they are on the **same local network**, even if they are geographically far apart.

For example, a branch in Korea and one in the United States can have the same network subnet:
- Without VPN:
	- 10.1.1.x (Korea)
	- 10.1.2.x (USA)
- With VPN:
	- 10.1.1.x (Korea)
	- 10.1.1.x (USA)

### Characteristics
- **Operates at the Data Link Layer**:
	- Uses Ethernet, Frame Relay, or ATM technologies to set up connections.
	- Uses MAC addresses to transmit data and behaves like a local network, even if the network is physically remote.
- **Encapsulation**:
	- Data Link Layer VPNs encapsulate Ethernet frames or data link layer frames for transmission across other networks.
	- Unlike Layer 3 VPNs, they do not handle IP headers, only encapsulating information necessary for the data link layer.
- **Transparency**:
	- Even if the networks are physically separated, they behave as a single **local area network (LAN)**, with no change at the application layer.

### **Layer 2 VPN Use Cases**
1. **Site-to-Site Connection**:
	- Used to connect two geographically distant sites (e.g., two data centers or office branches) as if they are on the same LAN.
	- For example, an Ethernet frame sent from Site A is transmitted to Site B and used as a local network.
2. **Service Provider VPN Services**:
	- Internet service providers offer **Layer 2 VPN** services to connect corporate networks across multiple locations.
3. **VLAN Connections**:
	- Can transmit **VLAN** as a virtual network, allowing separate VLANs to connect despite physical distance.

> What is VLAN? [[Network]VLAN](network-vlan)

### Advantages and Disadvantages

| **Item** | **Advantages** | **Disadvantages** |
| --- | --- | --- |
| **Transparent Network Connection** | - Behaves as the same LAN between different sites. **No impact on applications**. | - **Setup** and **management** can be more complex. |
| **Leverage Existing Infrastructure** | - Uses existing **Ethernet networks** or **VLANs**. | - Can lead to higher **bandwidth consumption**. |
| **Security** | - Enhances security through **encapsulation** and **encryption**. | - **Performance degradation** may occur due to packet encapsulation. |
| **Site-to-Site Connection** | - Connects **remote sites** without physical connections, acting like a local network. | - **Management complexity** increases as more sites are added. |
| **Scalability** | - **MPLS-based L2VPN** offers excellent scalability. | - **Complex configurations** may be required. |

