+++
date = '2024-12-21T10:57:31+09:00'
draft = false
title = '[Kubernetes] Pod, ReplicaSet, and Deployment'
tags = ["kubernetes","devops"]
categories = ["devops"]
+++

When you run an application, you have to use container such as docker.  
However, k8s does not directly deploy containers directly on the worker nodes.  
Containers are encapsulated in an object a.k.a. Pods.

### What is a Pod

- a set of running containers on your cluster.
- the smallest object that you can create in k8s
- you can have multiple containers in a single pod, but usually it has one-to-one relationship with an application
  - if multiple container is in a single pod, it is usually containers of different applications (Ex. main server container, helper daemon container)
  - can be communicated via `localhost` within pod
  
However, Pod has a [defined lifecycle](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)
_"For example, once a pod is running in your cluster then a critical fault on the node where that pod is running means that all the pods on that node fail. Kubernetes treats that level of failure as final: you would need to create a new Pod to recover, even if the node later becomes healthy."_

### Workload

In order to overcome defined lifecycle and manage pods more easily, you can use workload resources that manage a set of pods for you 😃  

Then workloads will configure controllers to manage pods for you
There are different types of workloads: Replicaset, Deployment, StatefulSet, Job/CronJob. I will talk about ReplicaSet and Deployment in this post.  



#### ReplicaSet 
- maintain a stable set of replica pods running at any give time 
- guarantees the availability of a specified number of identical pods  
- usually not used directly in modern k8s. You use Deployment instead, which will be discussed below. 

`example-replicaset.yaml`
```yaml
apiVersion: apps/v1
kind: ReplicaSet              # denotes ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  replicas: 3                 # Specifies that the ReplicaSet should maintain 3 running Pods.
  selector:                   # Defines the criteria to identify Pods that this ReplicaSet can manage.
    matchLabels:
      tier: frontend          # The ReplicaSet will only manage Pods that have a label "tier: frontend". 
  template:                   # specifying the data of new Pods it should create to meet the number of replicas criteria.
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: us-docker.pkg.dev/google-samples/containers/gke/gb-frontend:v5
```
If you manually add another pod with `tier: frontend` label, it will be counted toward replicas.  
For example, 3 pods (web server) are already running and you add another pod (backend) with `tier: frontend`, it will terminate one of the pod.  
Since there are not 4. So you need to be careful with labeling 🙃  


#### Deployment 
  - higher abstraction of replicaSet  or advancement of replicaSet.
  - manages a set of Pods to run an application workload, usually stateless one. 
  - when you describe a desired state in a Deployment, the Deployment Controller will change the actual state to the desired state at a controlled rate.
    - version, states, etc ... 
  
**Hmm... not really clear. Elaborate please 🧐**

_Taken from [StackOverflow](https://stackoverflow.com/questions/69448131/kubernetes-whats-the-difference-between-deployment-and-replica-set)_
```
Deployment resource makes it easier for updating your pods to a newer version.
Lets say you use ReplicaSet-A for controlling your pods, then You wish to update your pods to a newer version,
now you should create Replicaset-B, scale down ReplicaSet-A and scale up ReplicaSet-B by one step repeatedly 
(This process is known as rolling update).

Although this does the job, but it's not a good practice and it's better to let K8S do the job.
A Deployment resource does this automatically without any human interaction and increases the abstraction by one level.

Note: Deployment doesn't interact with pods directly, it just does rolling update using ReplicaSets.

```

Part of `example-deployment.yaml`
```yaml
kind: Deployment
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
```
In Deployment, you can specify how replicaSet will be updated by adding strategy under sepc like below.  
Also, you have to set kind to Deployment.



Reference  
https://kubernetes.io/docs/home/
https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/