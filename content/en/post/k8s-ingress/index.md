---
categories:
  - DevOps
date: 2025-01-27T15:12:04+09:00
draft: false
tags:
  - kubernetes
title: "[Kubernetes] Ingress"
---

Before reading this post, it will be helpful to have some knowledge about [Kubernetes Service](k8s-services). 😊

## Why is Ingress Necessary?

Let's explain this with an example. Imagine you are hosting an online shopping mall website using Kubernetes.  
This website consists of 3 service Pods and a single MySQL DB Pod.


### Issue 1
> How can external clients access this service from outside the cluster?

**Just expose it using NodePort.** 😏  
Then, you can access the service via `http://{node-ip}:{node-port}`.  
NodePort even handles traffic distribution across Pods automatically. 🚀


### Issue 2
> But connecting using a `node-ip` is a bit inconvenient… Can’t we just use `my-online-store.com` instead?

You can configure your DNS server to map `node-ip` to `my-online-store`.  
Then, you can access the service via `http://my-online-store:{node-port}`. Easy, right? 😉


### Issue 3
> Using `node-port` still feels clunky… I just want to use `my-online-store.com`. 😓

Okay, got it!  
In this case, you need to set up a **Proxy Server** between your DNS server and the Kubernetes cluster.  
The Proxy Server will route all incoming requests on port 80 to `http://{node-ip}:{node-port}`.

Now, you can access your service at `http://my-online-store`.

> **FYI:**  
> If no port is specified in the URL, the default ports are used:
> - For `http://`: Port **80**
> - For `https://`: Port **443**

Cloud solutions like GCP or AWS also offer this Proxy Server functionality under the name **Load Balancer**.  
![](Screenshot%202025-01-27%20at%203.58.13%20PM.png)

### Issue 4
> This works, but what if my website expands and starts offering other services?

In that case, you’d need a separate Load Balancer (Proxy Server) for each service. 😅  
![](Screenshot%202025-01-27%20at%204.17.39%20PM.png)

### Issue 5
> But now the services have different IPs… I want them to share the same IP.  
> For instance, I want to provide a new streaming service at `http://my-online-store.com/watch`.

Unfortunately, you’ll still need another Load Balancer for that. 😢  
![](Screenshot%202025-01-27%20at%204.19.10%20PM.png)


### Issue 6
> This solves the problem, but managing this setup seems challenging as the system scales.  
> Do I need a new Load Balancer/Proxy Server every time I add a new service?  
> Won’t this become expensive?  
> If I move to another cloud provider, wouldn’t I have to reconfigure all the Load Balancers?

Just use **Ingress**. 😎


## What is Ingress?
> An API object that shows how traffic from the internet should reach internal Kubernetes cluster Services that send requests to groups of Pods.

Simply put, **Ingress** is an L7 Load Balancer provided by Kubernetes.  
Since it’s a Kubernetes-native resource, it’s cloud-agnostic and easy to configure.

However, because it’s a Kubernetes resource, you’ll still need to connect it to the outside world via NodePort or a Load Balancer.  
Once connected, you can manage routing, SSL, and other features internally with ease.  
![](Screenshot%202025-01-27%20at%204.39.05%20PM.png)



### Components of Ingress
For Ingress to work properly, you need the following components:
- **Ingress Controller**
- **Ingress Resource**

### Ingress Controller
`Ingress` doesn’t function on its own. It requires an **Ingress Controller** to operate.

The Ingress Controller is a component deployed inside the cluster that observes `Ingress` resources and routes traffic based on defined rules.

There are various types of Ingress Controllers, with [nginx](https://github.com/kubernetes/ingress-nginx/blob/main/README.md#readme) being one of the most popular options.

> You can follow the guide on this page to deploy the nginx Ingress Controller in your cluster:  
> https://kubernetes.github.io/ingress-nginx/deploy/

Other examples:
- Traefik
- HAProxy
- Contour, etc.


### Ingress Resource
> A set of rules and configurations applied to the Ingress Controller to define routing and settings.

In most cases, when people refer to "Ingress," they mean the **Ingress Resource**.


### Example 1
An Ingress resource with the following rules:
- The base address for the Ingress Controller is `http://<IP>`.
- Traffic to `http://<IP>/testpath1` is routed to `test1:80`.
- Traffic to `http://<IP>/testpath2` is routed to `test2:80`.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
name: minimal-ingress
annotations:
nginx.ingress.kubernetes.io/rewrite-target: /
spec:
ingressClassName: nginx-example
rules:
- http:
  paths:
    - path: /testpath1
      pathType: Prefix
      backend:
      service:
      name: test1
      port:
      number: 80
    - path: /testpath2
      pathType: Prefix
      backend:
      service:
      name: test2
      port:
      number: 80
```

### Example 2
An Ingress resource with the following rules:
- Traffic to `foo.bar.com/bar` is routed to `service1:80`.
- Traffic to `*.foo.com/foo` is routed to `service2:80`.

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
name: ingress-wildcard-host
spec:
rules:
- host: "bar.foo.com"
  http:
  paths:
    - pathType: Prefix
      path: "/bar"
      backend:
      service:
      name: service1
      port:
      number: 80
- host: "*.foo.com"
  http:
  paths:
    - pathType: Prefix
      path: "/foo"
      backend:
      service:
      name: service2
      port:
      number: 80
```

### Checking Ingress

Run the following command to inspect the Ingress resource:
```bash
kubectl describe ingress minimal-ingress
```

---

**References**
- [Traefik Glossary: Kubernetes Ingress and Ingress Controller](https://traefik.io/glossary/kubernetes-ingress-and-ingress-controller-101/)
- [Udemy: Certified Kubernetes Administrator Course](https://samsungu.udemy.com/course/certified-kubernetes-administrator-with-practice-tests)

