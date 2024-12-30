+++
date = '2024-12-28T10:13:46+09:00'
draft = false
title = '[Kubernetes] Services'
tags = ["kubernetes"]
categories = ["devops"]
+++

## Basics of Kubernetes Networking 

In DevOps, network is always the most confusing part. So Imma try to organize it so that I do not forget about it.  
The post goes in this order
- Single Node Kubernetes Cluster
- Multi Node Kubernetes Cluster
- Kubernetes Service

### Single Node Kubernetes Cluster**

{{< figure src="/image/k8s-service-single-node.png" alt="alt" width="600" height="300" >}}

- The node has an IP address (e.g., 192.168.1.2), which is used for accessing the node or SSH into it.

**POD IP Addressing**  
- In Kubernetes, the IP address is assigned to a POD, not a container (unlike Docker).  
- Each POD gets its own internal IP address (e.g., 10.244.0.2).

**Kubernetes Internal Network**  
- Kubernetes creates an internal private network (e.g., 10.244.0.0) for the PODs.  
- Each POD receives a separate IP (e.g., 10.244.0.2, 10.244.0.3).  

**POD Communication**  
- PODs communicate with each other through their internal IPs.  
- Using internal IPs for communication isn't ideal because IPs may change when PODs are recreated.  

But using this internal IP to communicate is not a good idea. **WHY?**
- When pods go down and up, which it usually do very often, its IP will change.
- If you have set those IP as env, it will not work 😓 

### Multi Node Kubernetes Cluster

{{< figure src="/image/k8s-service-multi-node.png" alt="alt" width="600" height="300" >}}

- Two nodes with IP addresses (e.g., 192.168.1.2 and 192.168.1.3).
- Each node has a POD attached to an internal network with the same IP range (e.g., 10.244.0.0)
- Same IP Range causes conflict

**IP Conflict Problem**
Both nodes have PODs with the same IP addresses, causing IP conflicts when part of the same cluster.

**Kubernetes Networking Requirements**
- Kubernetes doesn't automatically set up networking to handle these issues.
- Networking must be set up manually to meet these fundamental requirements:
  - POD-to-POD communication across the cluster without NAT.
  - Node-to-POD and POD-to-node communication without NAT.

**Pre-built Networking Solutions**
There are several pre-built solutions available for Kubernetes networking, such as:
- Cisco ACI networks 
- Cilium 
- Big Cloud Fabric 
- Flannel 
- VMware NSX-T 
- Calico

If you use one of those solutions, it will manage the network and assign unique IPs in different networks in the node,  
which resolves all of those issues.

## Services

**Service** is a method for exposing a network application that is running as one or more Pods in your cluster.

#### Why do you need this? Can't you just use IP addresses of pods?  
Nah... because of following problems 😏

1. **Different types of PODs host different parts of the application**
   - Front-end web servers, Backend servers , Redis key-value store, MySQL persistent database ...
2. **Challenge of IP Addressing**
   - PODs have assigned IPs, but these are not static and can change as PODs are recreated.
   - You can't rely on IP addresses for internal communication within the application.

**Kubernetes Solution -> `Service`**
  - A Kubernetes service groups PODs together and provides a single interface to access them.
    - Example: A service for backend PODs groups them, allowing other PODs (like front-end) to connect via one interface.
  - Requests are forwarded to PODs in the group randomly.
    - Kubernetes services enable microservices architecture:
      - PODs can scale or move without disrupting communication between services.

There are three types of services that are most commonly used
- NodePort
- ClusterIP
- LoadBalancer

### NodePort
- makes internal pod accessible on a port on the node
- listens to a port on the node and forward requests on that port on the node 
- forwards requests on that port to a port on the pod running the web application 
- Valid Range
  - 300000 - 32767

{{< figure src="/image/k8s-nodeport.png" alt="alt" width="400" height="200" >}}

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service

spec:
  type: NodePort
  ports:
    - targetPort: 80      # if not provided, same as port
      port: 80            # required
      nodePort: 30008     # if not provided, an available node port will be assigned
  selector:             # used to designate which pod to connect
    app: myapp
    type: front-end  
```

**Multiple pods with same label**
- automatically selects all pods with the label as endpoints to forward the external request
- uses (RANDOM) algorithm, thus acting as a built-in load balancer

**Multiple pods across multiple nodes**
- no additional config needed. Service automatically takes care of this
- pods can be accessed via any IP of those nodes as shown below

{{< figure src="/image/k8s-nodeport-2.png" alt="alt" width="600" height="300" >}}


### ClusterIP
- Exposes the Service on a cluster-internal IP
- only reachable from within the cluster
- Default type if type is not specified for a Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: back-end
spec:
  type: ClusterIP # default
  ports:
    - targetPort: 80
      port: 80
  selector:
    app: myapp
    type: back-end

```

### LoadBalancer
- Exposes the Service externally using an external load balancer. 
- Kubernetes does not directly offer a load balancing component. 
- You must provide one or use with a cloud provider. As shown below, it is outside k8s.
  - If you specify kind as LoadBalancer when environment does not support it, it will simply convert to NodePort.

{{< figure src="/image/k8s-loadbalancer.png" alt="alt" width="600" height="300" >}}

#### What is the difference between NodePort and Load Balancer? 😓
| **Node Port** | **Load Balancer** |
|---------------|-------------------|
| By creating a `NodePort` service, you are saying to Kubernetes reserve a port on all its nodes and forwards incoming connections to the pods that are part of the service. | There is no such port reserve with `Load balancer` on each node in the cluster. |
| `NodePort` service can be accessed not only through the service’s internal `cluster IP`, but also through any node’s IP and the reserved node port. | Only accessible by `Load balancer` public IP. |
| Specifying the port isn’t mandatory. Kubernetes will choose a random port if you omit it (default range 30000 - 32767). | `Load balancer` will have its own unique, publicly accessible IP address and will redirect all connections to your service. |
| If you only point your clients to the first node, when that node fails, your clients can’t access the service anymore. | With `Load balancer` in front of the nodes to make sure you’re spreading requests across all healthy nodes and never sending them to a node that’s offline at that moment. |



Reference  
https://kubernetes.io/docs/home/  
https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/  
https://stackoverflow.com/questions/34443138/difference-between-nodeport-and-loadbalancer


