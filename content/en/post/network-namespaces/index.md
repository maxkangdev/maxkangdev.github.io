---
categories:
  - network|네트워크
date: 2025-01-25T12:14:57+09:00
draft: false
tags:
  - network
  - linux
title: "[Network] Namespaces"
---


This post is closely related to Docker networks. If you're not familiar with them, you might find it helpful to check out this post first: [[Docker] Network](docker-network).

## What is a Namespace?
Containers like Docker operate separately from the host system using the concept of **namespaces**.  
> If the host is a house, a namespace can be likened to a room within the house.

A container is isolated so it can only see its own processes, but the host can see everything.  
> **Namespace** is what makes this isolation possible.

For example, running `ps aux` inside a container will only show processes inside that container. However, running the same command on the host will reveal all processes, including those inside the container.  
The PIDs (process IDs) are different as the container assigns its own internal PID.

![](Screenshot%202025-01-25%20at%2012.23.02%20PM.png)

## Network Namespace
Network-related resources can also be isolated using namespaces.  

The host system typically manages an external LAN interface (e.g., `eth0`), a routing table, and an ARP table. Containers, on the other hand, maintain their own virtual interfaces (e.g., `veth0`), routing tables, and ARP tables.

![](Screenshot%202025-01-25%20at%2012.29.47%20PM.png)

### Creating a Network Namespace
> Two network interfaces (red & blue) are created.  
![](Screenshot%202025-01-25%20at%2012.31.37%20PM.png)

### Viewing Network Namespaces
> Use the following command to check interfaces on the host or within a specific namespace.  
![](Screenshot%202025-01-25%20at%2012.37.49%20PM.png)

### ARP Table
> Check the ARP table for the host network and the `red` namespace.  
![](Screenshot%202025-01-25%20at%2012.37.25%20PM.png)

### Routing Table
> Check the routing tables for the host and the `red` namespace.  
![](Screenshot%202025-01-25%20at%2012.38.08%20PM.png)

## Connecting Network Namespaces
> Just as physical computers connect using Ethernet cables, namespaces are connected using virtual Ethernet (veth).  

1. Create a virtual Ethernet pair:
```zsh
# Create a veth pair connecting veth-red and veth-blue
ip link add veth-red type veth peer name veth-blue
```

2. Attach each interface to its respective namespace:
```zsh
ip link set veth-red netns red
ip link set veth-blue netns blue
```

3. Assign IP addresses:
```zsh
ip -n red addr add 192.168.15.1 dev veth-red
ip -n blue addr add 192.168.15.2 dev veth-blue
```

4. Activate the interfaces:
```zsh
ip -n red link set veth-red up
ip -n blue link set veth-blue up
```

Check ARP tables for updates:
```zsh
ip netns exec red arp
ip netns exec blue arp
```

Ping between namespaces:
```zsh
ip netns exec red ping 192.168.15.2
```

The host's ARP table will not include this information because it isn't needed.

![](Screenshot%202025-01-25%20at%2012.44.12%20PM.png)

## Connecting More than Two Namespaces
When connecting multiple namespaces, it's tedious to manage individual links. A **virtual switch** like Linux Bridge or Open vSwitch can be used.  
> Docker’s default network driver is Linux Bridge, which is why a `bridge` network is automatically created for containers.

1. Create a virtual switch interface:
```zsh
ip link add v-net-0 type bridge
ip link set dev v-net-0 up
```

2. Delete old veth pairs:
```zsh
ip -n red link del veth-red
ip -n blue link del veth-blue
```

3. Create new veth pairs and attach them to namespaces and the bridge:
```zsh
ip link add veth-red type veth peer name veth-red-br
ip link add veth-blue type veth peer name veth-blue-br

ip link set veth-red netns red
ip link set veth-red-br master v-net-0
ip link set veth-blue netns blue
ip link set veth-blue-br master v-net-0
```

4. Assign IPs and activate:
```zsh
ip -n red addr add 192.168.15.1 dev veth-red
ip -n blue addr add 192.168.15.2 dev veth-blue
ip -n red link set veth-red up
ip -n blue link set veth-blue up
```

The host can access the namespace network by assigning an IP to the bridge:
```zsh
ip addr add 192.168.15.5/24 dev v-net-0
```

Add a gateway for external communication:
```zsh
ip netns exec blue ip route add default via 192.168.15.5
```

### Port Forwarding for External Access
To allow external access, set up port forwarding:
```zsh
iptables -t nat -A PREROUTING --dport 80 --to-destination 192.168.15.2:80 -j DNAT
```
> `iptables` is the default firewall tool for Linux-based systems.


