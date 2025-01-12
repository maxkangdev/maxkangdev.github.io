---
categories:
  - devops
date: 2025-01-12T12:09:56+09:00
draft: true
tags:
  - network
  - linux
title: Linux Networking Basics
---

## Switching

Let's assume there are two computers (A and B). They could be laptops or VMs.

#### How does A communicate with B?

They connect through a switch. When two computers are connected to a switch, the switch creates a network that includes both computers.  
To connect each computer to the switch, you need to connect via an interface. You can check the interface information with the following command:

`ip link` Show information for all interfaces
```zsh 
ip link show dev em1  # Display information only for device em1

ip link set em1 up         # Bring em1 online
ip link set em1 down       # Bring em1 offline
ip link set em1 mtu 9000   # Set the MTU on em1 to 9000
ip link set em1 promisc on # Enable promiscuous mode for em1
```

> mtu(maximum transmission unit)  
> **the largest size frame or packet -- in bytes or octets (eight-bit bytes) -- that can be transmitted across a data link**

Once you check the interface, you need to connect one of the interfaces to the switch.  
You can use the command `ip addr add` to connect.

`ip addr` Show information for all addresses
```zsh 
ip addr show dev em1               # Display information only for device em1

ip addr add 192.168.1.1/24 dev em1 # Add address 192.168.1.1 with netmask 24 to device em1
ip addr del 192.168.1.1/24 dev em1 # Remove address 192.168.1.1/24 from device em1
```

For example, to connect A and B to the switch via the em1 interface, use the following commands:
```zsh 
ip addr add 192.168.1.10/24 dev em1
# (A) Add address 192.168.1.1 with netmask 24 to device em1

ip addr add 192.168.1.11/24 dev em1
# (B) Add address 192.168.1.1 with netmask 24 to device em1
```

![](Screenshot%202025-01-12%20at%2012.20.44%20PM.png)

Now, A and B can communicate with each other. (Ping will get a response)

#### How do I connect to a computer on a different network?

## Routing

For example, if you want to communicate from B to C as shown below:
![](Screenshot%202025-01-12%20at%2012.23.16%20PM.png)

What you need is a **router**.  
A router helps connect two networks. Think of it as a server with multiple network ports.  
Since it connects to multiple networks, it has multiple IP addresses, one for each network.

But how do we know which router to use and where to send the communication?
### Gateway

That's where the **Gateway** (or Route) comes in.
> If a network is a room, the Gateway is the door.  
> Therefore, the system needs to know where the door is, so it can go anywhere 🏃‍♂️

To find this information in the system, use the following command -> `route` (`netstat -nr` on macOS).  
If it's not set, communication from B to C won't work.

To set it, use the following command to register the route. Using the example above, it would look like this:
```zsh
# Through 192.168.1.1, go to 192.168.2.0/24!
# ip route add <destination> via <Gateway>
ip route add 192.168.2.0/24 via 192.168.1.1
```

`ip route` List all of the route entries in the kernel
```zsh 
ip route add default via 192.168.1.1 dev em1
# Add a default route (for all addresses) via the local gateway 192.168.1.1 that can be reached on device em1

ip route add 192.168.1.0/24 via 192.168.1.1
# Add a route to 192.168.1.0/24 via the gateway at 192.168.1.1
ip route add 192.168.1.0/24 dev em1
# Add a route to 192.168.1.0/24 that can be reached on device em1
```

#### How do I connect to the internet?

![](Screenshot%202025-01-12%20at%2012.42.48%20PM.png)

This is the same as before. If the internet IP is 172.217.194.0, you can set it like this:
```zsh
# Through 192.168.2.1, go to 172.217.194.0 (the internet)!
ip route add 172.217.194.0 via 192.168.2.1
```

#### But there are so many websites!! Do I need to do this for each one?! 😡

No, you don't.  
Instead of registering every time, you can simply set a default route like this:

```zsh
# For IPs that are neither internal networks nor specifically routed, use this default...
ip route add default via 192.168.2.1
```

You can also use `0.0.0.0` instead of `default`.  
`0.0.0.0` means "Any IP destination."

If the Gateway is set to `0.0.0.0`, it means there is no need for a Gateway.  
When does this happen? It occurs when both systems are in the same network.

### When there are more than one router

Assume two routers:
- One for connecting to the internet
- One for connecting to an internal private network

In this case, you need more than one Gateway:
- Gateway for the internet
- Gateway for the internal network

## Using Linux as a Router

In a setup like the following, how does A communicate with B?
![](Screenshot%202025-01-12%20at%2012.58.18%20PM.png)

First, if you try `ping 192.168.2.5` from A, it won't work. So, you need to set it like this:
```zsh
# Go to the 192.168.2.0 network via 192.168.1.6 Gateway.
ip route add 192.168.2.0 via 192.168.1.6
```

But even then, when C tries to communicate with A, the same problem occurs. You need to set a similar configuration on C:
```zsh 
# Go to the 192.168.1.0 network via 192.168.2.6 Gateway.
ip route add 192.168.1.5 via 192.168.2.6
```

At this point, pinging will fail 😆, not because of an error, but because no response is received 😵‍💫.

**Why is that?**  
Linux doesn't forward packets through interfaces.  
For example, if a packet is sent through B's `eth0`, it doesn't go through other interfaces like `eth1`.

**Why?**  
This is a security issue.  
For example, if `eth0` is connected to an internal network and `eth1` is connected to an external public network, you don't want packets arriving on `eth1` to flow into the internal network through `eth0`.

Of course, you can configure it to allow this. It doesn't matter if both networks are internal, right?  
This setting is stored in the file below:
```zsh
cat /proc/sys/net/ipv4/ip_forward
0
```

By default, it's set to 0, but if you change it to 1, you'll be able to get a response when you ping.

However, this will reset to 0 when the computer is restarted, so you need to add the setting to the following file:
```zsh 
# /etc/sysctl.conf
net.ipv4.ip_forward=1
```

## DNS

It's really hard to remember IPs. Isn't there a way to call them differently?  
Yes, there is -> DNS (Domain Name System).

You can easily configure it by modifying the /etc/hosts file.  
```zsh
# /etc/hosts
192.168.1.11    db
```
With this setup, instead of `ping 192.168.1.11`, you can just `ping db` (works with ssh, curl, etc.).

This method of registering names that map to IPs in /etc/hosts is called **Name Resolution**.  
Of course, when there aren't many computers like in the example below, this is how it was done.  
![](Screenshot%202025-01-12%20at%201.45.21%20PM.png)

#### But imagine when there are more computers...

It becomes hard to manage...  
If the IP of a computer changes, you have to update the /etc/hosts file of every other computer...  
![](Screenshot%202025-01-12%20at%201.46.07%20PM.png)

So instead of managing it individually, everyone switched to using a common **DNS server** and resolving names through that server.  
But how is that done?

If the DNS Server has the IP 192.168.1.100 as shown in the picture, you can register it in the /etc/resolv.conf file on each host as follows:  
```zsh
# /etc/resolv.conf
nameserver    192.168.1.100
```
With this registration, when a host encounters an unknown hostname, it queries the DNS server for that hostname.  
This way, even if the host's IP address changes, you only need to update the DNS server 😆  
![](Screenshot%202025-01-12%20at%202.10.04%20PM.png)

If the same hostname is registered both locally and on the DNS server, the local one takes precedence.  
This setting is specified in the file below, and if you change the order in the dns files section, the DNS server will have priority.  
```zsh
# /etc/nsswitch.conf
...
hosts:    files dns
```
You can also add multiple DNS servers.  
```zsh
# /etc/resolve.conf
nameserver 192.168.1.100
nameserver 8.8.8.8  # a common well-known DNS server hosted by Google that knows all the websites on the internet
```
But this means you'd still have to modify /etc/hosts on each host whenever a new DNS server is added,  
so if the DNS server doesn't know a name, it can forward the request to another DNS server.

## Domain Names
A domain name like www.google.com is structured as follows:
- `.` Root
- `.com` Top Level Domain Name
- `google` Domain name
- `www` Subdomain
   - Used to further categorize the domain service
   - e.g. `mail` (Gmail), `map` (Google Maps), etc.

**So what happens when you call `apps.google.com` in an internal network?**

1. The internal DNS server (Org DNS) first queries the IP for `apps.google.com`.
2. The internal DNS server doesn't know, so it asks a public DNS server. It will go through several DNS servers, but one example would be:
   1. The `Root DNS` looks up `.com DNS`.
   2. The `.com DNS` asks `Google DNS`.
   3. `Google DNS` responds with the IP.
3. Finally, the internal DNS server receives the IP and provides it.  
   *Additionally, the internal DNS server will likely cache this information... since it's Google...*

**Do Google employees also access `apps.google.com` the same way?**

I'm not sure since I don't work at Google 🤔 But let's assume they don't.  
Wouldn't Google employees be able to just enter `apps` directly?!  
If configured like below, the name resolution will append the search domain, so the request is automatically handled.  
```zsh
# /etc/resolve.conf
nameserver 192.168.1.100
search google.com
```
`ping apps` -> `ping apps(.google.com)`

**Then isn't `ping apps.google.com` equivalent to `ping apps.google.com(.google.com)`?!**  
Developers are not that careless... it's handled automatically 😝

You can also specify multiple search domains like this:  
```zsh
search google.com dev.google.com
```

## Record Types

The information stored in DNS servers generally falls into three main types (there are more, but knowing these will be sufficient):
- A
   - hostname : IP
   - Ex. web-server : 192.168.1.1
- AAAA
   - hostname : IPv6
   - Ex. web-server: 2001:0000:130F:0000:0000:09C0:876A:130B
- CNAME
   - hostname : another hostname
   - Used when you want to use a different name for the same site
   - e.g. food.web-server : eat.web-server, hungry.web-server  

## Network Namespaces

In the case of containers like Docker, they operate isolated from the host system through a concept called **namespace**.
> If the host is a house, the namespace is like a room inside the house?

Containers are isolated so that they can only see their internal processes, but the host can see everything.  
This is made possible by the **namespace**.

When you run `ps aux` inside a container, you will only see its internal processes. But when you run `ps aux` on the host, you will see everything, including what's inside the container.  
However, the PID is different because containers assign separate IDs for processes within their environment.

#### So, what about container networks?
![](Screenshot%202025-01-12%20at%204.29.47%20PM.png)
As mentioned above, the host has its own network interfaces set up. But since containers are created in isolation, they don't have access to the host's network information and instead get their own unique network (Virtual Network Interface).

To view the network information on a Linux system, run the following commands:
```zsh 
ip netns add red    # Create network called red    
ip netns add blue   # Create network called blue
ip netns # list existing network
```

To view network interface information:
```zsh 
ip link  # Host network interface info

# Interface info for a specific network (red)
ip netns exec red ip link
= 
ip -n red link

# Interface info for a specific network (blue)
ip netns exec blue ip link
= 
ip -n blue link
```

The ARP table and routing tables work the same way:
```zsh 
arp      # Host address resolution protocol info

ip netns exec red arp
ip netns exec blue arp

route    # Host routing table info

ip netns exec red route
ip netns exec blue route
```

#### How do container networks connect with each other?

Just like how you connect a real computer using an Ethernet cable, containers are connected using virtual Ethernet (veth).

1. First, create virtual Ethernet:
```zsh
# Create a virtual Ethernet cable (or pipe) connecting veth-red and veth-blue
ip link add veth-red type veth peer name veth-blue
```

2. Attach the interfaces to the respective namespaces:
```zsh
ip link set veth-red netns red     # Attach veth-red to red
ip link set veth-blue netns blue   # Attach veth-blue to blue
```

3. Assign IP addresses to the interfaces:
```zsh
ip -n red addr add 192.168.15.1 dev veth-red     # Assign 192.168.15.1 to veth-red in the red namespace
ip -n blue addr add 192.168.15.2 dev veth-blue   # Assign 192.168.15.2 to veth-blue in the blue namespace
```

4. Bring the interfaces up:
```zsh
ip -n red link set veth-red up
ip -n blue link set veth-blue up
```

Afterward, if you check the ARP table using the following commands, you'll see new information:
```zsh 
ip netns exec red arp
ip netns exec blue arp
```

#### What if there are multiple containers? Do I have to do this for each one?

No, you can use a switch just like in real networks, but this time it's virtual...

To create a virtual switch, you'll need solutions like Linux Bridge or Open vSwitch. Here, we'll use Linux Bridge.

1. Create an interface for the virtual switch:
```zsh
ip link add v-net-0 type bridge
```
You can verify its creation using `ip link`. However, it's initially off, so you need to bring it up:
```zsh
ip link set dev v-net-0 up
```

2. Connect the namespaces to the virtual switch:
First, remove the previously created veth interfaces as we won't use them anymore:
```zsh
ip -n red link del veth-red     # Deleting one of the pair removes both.
ip -n blue link del veth-blue   # No need to do this.
```

Next, create new virtual Ethernet cables to connect the namespaces to the bridge:
```zsh 
ip link add veth-red type veth peer name veth-red-br # Create interface for veth-red <-> veth-red-br

ip link add veth-blue type veth peer name veth-blue-br  # Create interface for veth-blue <-> veth-blue-br
```

Attach the interfaces:
```zsh 
ip link set veth-red netns red          # Attach veth-red to the red namespace
ip link set veth-red-br master v-net-0  # Attach veth-red-br to the bridge

ip link set veth-blue netns blue        # Attach veth-blue to the blue namespace
ip link set veth-blue-br master v-net-0 # Attach veth-blue-br to the bridge
```

3. Assign IP addresses and activate the interfaces:
```zsh
ip -n red addr add 192.168.15.1 dev veth-red
ip -n blue addr add 192.168.15.2 dev veth-blue
ip -n red link set veth-red up
ip -n blue link set veth-blue up
```

This setup allows containers in multiple namespaces to communicate with each other!

However, if you try to access this network from the host, it will fail. Why? Because they are separate networks.

#### How do I connect the host to this network?
Think of the virtual switch (v-net-0) as an interface inside the host.  
Thus, you can simply assign an IP to the interface and access it using that IP.
```zsh
ip addr add 192.168.15.5/24 dev v-net-0  # Assign 192.168.15.5 to v-net-0
```
Now, you can access the network via 192.168.15.5.

#### But how do containers access the external internet?

Exactly. Since only the host's Ethernet port is connected, containers can't communicate with the outside world.  
For example, when a container tries to ping `192.168.1.3`, the following happens:
1. It realizes `192.168.1.3` isn't in its internal IP range (192.168.15.0/24).
2. It tries to find the destination in the routing table.
3. It can't find it. Oops!

To solve this, you need to add gateway information to the routing table.

Who is the gateway? It's the one that connects both v-net-0 and the outside world: the `localhost`. So, you just route through the local interface:
```zsh
ip netns exec blue ip route add 192.168.1.0/24 via 192.168.15.5
# Route 192.168.1.0/24 via the virtual switch (192.168.15.5)
```

Now, you should be able to ping without errors, but still won't receive a response...  
To send a response back, the container needs to know the external IP, but it uses the internal network IP.

To solve this, set the host IP to be used for outgoing traffic from the internal network:
```zsh 
iptables -t nat -A POSTROUTING -s 192.168.15.0/24 -j MASQUERADE
``` 
Now, ping should work fine.

Finally, containers still won't be able to access the internet. This is because only the routing table for `192.168.1.0` is set.  
To solve this, set the default route via localhost:
```zsh
ip netns exec blue ip route add default via 192.168.15.5
```

#### Can I communicate from outside to inside the network?
No, since it's a private network.

To enable communication, you need to use port forwarding.  
For example:
```zsh
iptables -t nat -A PREROUTING --dport 80 --to-destination 192.168.15.2:80 -j DNAT
# Forward all requests on host port 80 to port 80 of 192.168.15.2
```

This should cover the basics of Linux networking.

Reference  
https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/
