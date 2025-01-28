---
categories:
  - network|네트워크
date: 2025-01-26T14:39:08+09:00
draft: false
tags:
  - network
  - docker
title: "[Network] CNI"
---


## Background

[[Network] namespaces](network-namespaces)
In the above post, we explored how network namespaces are created and connected.

1. Create Network Namespace
2. Create Bridge Network/Interface
3. Create VETH Pairs (Pipe, Virtual Cable)
4. Attach vEth to Namespace
5. Attach Other vEth to Bridge
6. Assign IP Address
7. Bring the interfaces up
8. Enable NAT - IP Masquerade

Since networking is essential in almost every system, not just Docker but all other container-related solutions must implement the steps above.

> Examples: Docker, Rocket, Mesos, Kubernetes, etc.  
![](Screenshot%202025-01-26%20at%202.44.22%20PM.png)

But wouldn’t it be more efficient if someone implemented these features once, and others could reuse it? 😓

That’s where the **Bridge plugin** comes in. Solutions like Rocket and Kubernetes can utilize the Bridge plugin to handle complex network creation and connections more easily.

> But what if I don’t want to use the Bridge plugin and want to implement something else?  
> Is there a standardized interface that allows solutions like Kubernetes or Rocket to invoke their respective implementations?

That’s what **CNI** is for. 🫠

## CNI (Container Network Interface)
> A standard for building plugins to control networking between containers.  
> The Bridge plugin is just one example of a plugin that implements CNI.

CNI specifies the interfaces that must be implemented by both container solutions and plugins.

### Responsibilities of the Container Runtime
- Must create the network namespace.
- Must inform the plugin about the network to which the container should connect.
- Must invoke the plugin using the `Add` command when a container is added.
- Must invoke the plugin using the `Delete` command when a container is deleted.
- Must configure the plugin using a JSON format.

### Responsibilities of the Plugin
- Must support `ADD`, `DEL`, and `CHECK` commands.
- Must accept parameters such as container ID and network namespace.
- Must allocate IP addresses for each Pod and set up routing for communication between containers.
- Must return results in a specific format.

As long as container runtimes and plugins adhere to these rules, they can be seamlessly interchanged and operate properly.

## Exceptions

Most systems follow CNI, but Docker doesn’t. Docker uses something called **CNM (Container Network Model)**, which is similar to CNI but slightly different.

As a result, Kubernetes cannot use CNI plugins directly with Docker’s networking.

```zsh  
❌ docker run --network=cni-bridge nginx  
```  

However, this doesn’t mean it’s impossible to use Docker. You can simply omit specifying the network during container creation and invoke the CNI plugin separately.
> In fact, Kubernetes uses Docker in this way.
```zsh  
docker run --network=none nginx  
bridge add 2e34dcf34 /var/run/netns/2e34dcf34  
```  






