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


