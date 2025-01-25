---
categories:
  - DevOps
date: 2025-01-24T11:50:55+09:00
draft: false
tags:
  - docker
title: "[Docker] 도커란?"
---


## What is Docker?
> **"Container"** technology that packages an application and its runtime environment into a single package, making it easy to run anywhere. (Programmed in Go)

### Simply Put
- To run an application, you typically need various components like **code, libraries, configurations, and databases**.
- However, setting up this environment can be challenging due to differences in operating systems, developers' setups, and tangled configurations, leading to the infamous **"It works on my machine!"** problem. 😓

> **Enter Docker**

Docker packages the application and everything it needs to run into a "container." With this,
1. Whether running on **my computer**,
2. **a teammate's computer**, or
3. **a server** or **the cloud**,  
   it all works **exactly the same**. 😤

## Analogy
When you cook a meal, you need ingredients, recipes, and a kitchen, right?

Docker is like giving you a **fully prepared meal in a lunchbox**:
- You can open and eat it anywhere.
- Even better, there's a recipe (Docker image) included so you can prepare a new one if needed.

## Docker Architecture
> Follows a client-server architecture

Installing Docker means you're actually installing the following three components:
- Docker CLI `docker`
- REST API
- Docker Daemon `dockerd`

The Docker CLI communicates with the Docker Daemon using the Docker REST API.  
The Docker Daemon, in turn, handles all the tasks, like creating or removing Docker objects such as images, containers, networks, and volumes.

> **Note**  
> The Docker CLI does not need to be on the same environment as the daemon. You can configure remote access to interact with a Docker engine (API + Daemon) on another host.  
> Example: `docker -H=remote-docker-engine:1234`

## Docker Architecture (Official)
> Below is an image provided by the official Docker website:  
![](Screenshot%202025-01-24%20at%2011.46.18%20AM.png)
- **Client** = CLI
- **Docker Host** = REST API + Docker Daemon + locally managed images and containers by the daemon
- **Registry** = External storage for images, extensions, and plugins


