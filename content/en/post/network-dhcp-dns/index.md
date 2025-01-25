---
categories:
  - network|네트워크
date: 2025-01-23T11:25:28+09:00
draft: false
tags:
  - network
title: "[Network] DHCP, DNS"
---
## DHCP (Dynamic Host Configuration Protocol)
> **DHCP (Dynamic Host Configuration Protocol)** is a protocol that allows devices connected to a network (such as computers, smartphones, printers, etc.) to automatically receive an **IP address** and other **network settings**.

When you go to the computer's IP settings, you usually see two options:
1. Obtain an IP address automatically
2. Manually set IP address

If you know which IP to use, select option 2 and set it up manually.  
However, if you choose the first option, it means "let the system assign it for me!" But to do this, a **DHCP** server must be set up.
> A server can be set up separately, or in many cases, the router acts as a DHCP server.

### Key Features
- **Automatic IP address assignment**  
  When a device connects to the network, it sends a request to the DHCP server, which automatically assigns an **IP address** to the device.
- **Provides other network information**  
  Besides the IP address, DHCP also provides subnet mask, gateway, DNS server, and other network information to the device.
> You can see this information with `ifconfig`.

### Operation Process
1. **DHCP Discover**  
   The device connected to the network sends a **DHCP Discover message** as a broadcast to find the DHCP server.
2. **DHCP Offer**  
   The DHCP server receives this message and sends a **DHCP Offer message** containing the **IP address and network settings** to the device.
3. **DHCP Request**  
   The device selects one of the received Offer messages and sends a **DHCP Request message** to confirm the request.
4. **DHCP Ack**  
   The DHCP server allocates the requested IP address and settings to the device, confirming it with a **DHCP Ack message**.

### Benefits
- **Automation**: Devices automatically receive IP addresses, eliminating the need for manual configuration.
- **Easy management**: In large networks, IP address management becomes easier and collisions can be prevented.
- **Flexibility**: Changes made on the DHCP server can be easily applied to all connected devices.

### Advantages
- **Easy network management**: IP addresses are managed automatically by the DHCP server without the need for manual allocation.
- **Prevention of IP address conflicts**: The DHCP server ensures that IP addresses are not assigned to more than one device.
- **Flexibility**: IP addresses are automatically renewed and can be reassigned when needed.

### Disadvantages
- **Security issues**: If the DHCP server is compromised, it may assign incorrect IP addresses or settings to devices.
- **IP address renewal**: DHCP periodically renews IP addresses, which can cause disruptions in connectivity.

## DNS (Domain Name System)
> **DNS (Domain Name System)** is a system that converts **domain names** used on the internet into **IP addresses**.

For example, it converts `www.google.com` into `142.241.40.196`.

### Key Features
- **Converts domain names into IP addresses**  
  For internet access, each device needs to know the IP address. DNS converts the domain name entered by the user into the corresponding IP address.
- **Email routing**  
  Through the **MX records**, DNS helps deliver emails to the correct email server.
- **Name server management**  
  DNS uses various **name servers** to manage and provide information about domain names.

### Operation Process
1. **User enters domain name**  
   When a user types `example.com` in the browser, it uses DNS to convert the domain name into an IP address.
2. **Check local cache**  
   The computer or device first checks if the IP address of `example.com` is cached. If it's found, it directly uses that IP address to connect to the website.
3. **Request DNS resolver**  
   If the address is not cached, the computer sends a request to the DNS resolver, usually provided by the ISP, which is responsible for finding the IP address of the domain.
4. **Root DNS server**  
   If the DNS resolver doesn't know the domain, it sends a request to the root DNS server. The root server is at the top of the DNS hierarchy and informs which DNS server holds the domain information.
5. **TLD DNS server**  
   The root server guides the request to the TLD DNS server based on the domain's top-level domain (TLD), such as `.com` or `.org`.
6. **Authoritative DNS server**  
   The TLD server directs the request to the authoritative DNS server, which holds the actual IP address for the domain (e.g., `example.com`).
7. **Return IP address**  
   The authoritative DNS server returns the IP address for `example.com`.
8. **Browser connects**  
   The DNS resolver provides the IP address to the browser, which then uses it to connect to the website’s server.
9. **Cache storage**  
   The IP address is stored in both the browser and DNS resolver's cache for faster processing of future requests.

### Benefits of DNS
- **Convenience**: Allows users to access websites using easy-to-understand domain names instead of IP addresses.
- **Flexibility**: DNS allows management of domain names in alignment with IP address changes, enabling continued use of the domain name even if the IP address changes.
- **Distributed system**: DNS operates in a distributed system where multiple servers collaborate, ensuring **fast responses** and **reliability**.

### Disadvantages of DNS
- **Security vulnerabilities**: DNS can be targeted by attacks like **DNS spoofing** (DNS cache poisoning), which misleads users by redirecting them to incorrect IP addresses.
- **Dependence on centralized systems**: If key DNS servers go down, many users may lose access to the internet.

## Real-World Example

You can easily configure name resolution by modifying the `/etc/hosts` file.
```zsh
# /etc/hosts
192.168.1.11    db
```
With this setup, instead of running `ping 192.168.1.11`, you can simply run `ping db` (also works for `ssh`, `curl`, etc.).

This method of registering names mapped to IPs in `/etc/hosts` is called **Name Resolution**.  
In the past, when there were only a few computers, this method was commonly used.  
![](Screenshot%202025-01-12%20at%201.45.21%20PM.png)

#### But what if the number of computers keeps increasing?

Management becomes difficult...  
For example, if even one computer’s address changes, you would need to update the `/etc/hosts` file on every other machine.  
![](Screenshot%202025-01-12%20at%201.46.07%20PM.png)

To address this, people stopped managing this individually and instead introduced a shared **DNS Server** to handle name resolution for everyone.

**How does this work?**

If the DNS server has an IP of `192.168.1.100`, each host can be configured by adding the following to the `/etc/resolv.conf` file:
```zsh
# /etc/resolv.conf
nameserver    192.168.1.100
```
With this configuration, when a host encounters an unknown hostname, it queries the DNS server to resolve it.  
This way, even if a host’s IP address changes, you only need to update the DNS server 😆.  
![](Screenshot%202025-01-12%20at%202.10.04%20PM.png)

If a hostname is registered both locally and on the DNS server, the local entry takes priority.  
This behavior is controlled by the `/etc/nsswitch.conf` file, where you can change the priority by placing `dns` before `files`.
```zsh
# /etc/nsswitch.conf
...
hosts:    files dns
```

You can also add multiple DNS servers:
```zsh
# /etc/resolv.conf
nameserver 192.168.1.100
nameserver 8.8.8.8  # Google's public DNS server that knows all the websites on the internet
```
But then again, if a new DNS server is added, you would need to update `/etc/resolv.conf` on every host. To avoid this, DNS servers can forward requests for unknown names to other DNS servers.


## Domain Name Structure

`www.google.com` is an example of a domain name, structured as follows:
- `.` Root
- `.com` Top-Level Domain (TLD)
- `google` Domain Name
- `www` Subdomain
    - Used to further segment domain services.
    - Examples: `mail` (Gmail), `map` (Google Maps), etc.

**So, what happens when you access `apps.google.com` in a corporate environment?**

1. The corporate DNS server (Org DNS) is queried for the IP of `apps.google.com`.
2. If the corporate DNS server doesn’t know, it queries a public DNS server. The process might look like this:
    1. The `Root DNS` directs the query to `.com DNS`.
    2. `.com DNS` forwards it to `Google DNS`.
    3. `Google DNS` provides the IP.
3. The corporate DNS server receives the IP and returns it to the requester.  
   *Additionally, the corporate DNS server will likely cache this information for efficiency.*

**Do Google employees also access `apps.google.com` like this?**

I don’t work at Google, so I can’t say for sure 🤔, but let’s assume they don’t.  
Wouldn’t it make sense for Google employees to simply access it as `apps`?  
By configuring the system like this, name resolution appends the search domain automatically:
```zsh
# /etc/resolv.conf
nameserver 192.168.1.100
search google.com
```
`ping apps` -> `ping apps(.google.com)`

**But doesn’t `ping apps.google.com` turn into `ping apps.google.com(.google.com)`?**  
Developers aren’t that careless... The system handles it properly 😝.

You can also specify multiple search domains:
```zsh
search google.com dev.google.com
```

## Record Types

DNS servers store various types of information. The three most common ones are:

- **A**
    - Maps a hostname to an IPv4 address.
    - Example: `web-server : 192.168.1.1`

- **AAAA**
    - Maps a hostname to an IPv6 address.
    - Example: `web-server : 2001:0000:130F:0000:0000:09C0:876A:130B`

- **CNAME**
    - Maps a hostname to another hostname.
    - Useful for assigning multiple names to the same site.
    - Example: `food.web-server : eat.web-server, hungry.web-server`

