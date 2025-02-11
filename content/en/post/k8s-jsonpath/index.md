---
categories:
  - DevOps
date: 2025-02-11T20:29:57+09:00
draft: false
tags:
  - kubernetes
title: "[Kubernetes] JsonPath in Kubernetes"
---

**If you're not familiar with JsonPath, check out [this post](jsonpath) first :)**  

## JsonPath in Kubernetes  
When using `kubectl`, it works as follows:  
1. `kubectl` sends a request to `kube-apiserver`.  
2. `kube-apiserver` responds with a JSON-formatted reply.  
3. `kubectl` parses the JSON response and displays it in a readable format in the terminal.  

The response from `kube-apiserver` contains a large amount of information, but `kubectl` filters and presents only the essential details for readability.  
Some commands allow additional details using `-o wide`, but even then, not all information is displayed.  

> What if you want more detailed information? Or if you want to extract only specific data in a customized way?  

You can use **JsonPath**.  
JsonPath allows you to extract the exact information you need from the JSON response returned by `kube-apiserver`.  

A primary use case of JsonPath is **extracting specific fields from API response data**.  

## How to Use  
1. Run the desired `kubectl` command:  
   ```zsh
   kubectl get pods
   ```
2. Check the JSON output format:
   ```zsh
   kubectl get pods -o json
   ```
3. Write a JsonPath query:
   ```zsh
   .item[0].spec.containers[0].image
   ```
   > The `$` symbol is not required.

4. Use the JsonPath query with `kubectl`:
   ```zsh
   kubectl get pods -o=jsonpath='{.item[0].spec.containers[0].image}'
   ```
   > The JsonPath query must be enclosed in `{}`.

## Examples & Additional Usage

### Get Node Names in the Cluster
```zsh
kubectl get nodes -o=jsonpath='{.items[*].metadata.name}'
```

### Get Hardware Architecture of Each Node
```zsh
kubectl get nodes -o=jsonpath='{.items[*].status.nodeInfo.architecture}'
```

### Get CPU Count of Each Node
```zsh
kubectl get nodes -o=jsonpath='{.items[*].status.capacity.cpu}'
```

### Combine Multiple Queries
```zsh
kubectl get nodes -o=jsonpath='{.items[*].metadata.name}{.items[*].status.capacity.cpu}'
```
However, this output may not be well-formatted.  
To format the output with line breaks, add `{"\n"}`:
```zsh
kubectl get nodes -o=jsonpath='{.items[*].metadata.name}{"\n"}{.items[*].status.capacity.cpu}'
```
For tab spacing, use `{"\t"}`.

### Handling Single Quotes in JsonPath
When using single quotes `'` inside a JsonPath query, wrap the entire query in double quotes `"`:
```zsh
kubectl config view --kubeconfig=/root/my-kube-config -o=jsonpath="{.contexts[?(@.context.user=='aws-user')]}"
```

### Using Loops in JsonPath
If you run the following command:
```zsh
kubectl get nodes -o=jsonpath='{.items[*].metadata.name}{"\t"}{.items[*].status.capacity.cpu}{"\n"}'
```
You might get output like this:
```zsh
master node01 
4	   4
```
But the desired output format is:
```zsh
master 4
node01 4
```
> To achieve this, use loops:
```zsh
kubectl get nodes -o=jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.capacity.cpu}{"\n"}{end}'
```

### Custom Columns
The same result can be achieved using `custom-columns`:
```zsh
# Syntax: kubectl get nodes -o=custom-columns=<COLUMN_NAME>:<JSON_PATH>
kubectl get nodes -o=custom-columns=NODE:.metadata.name,CPU:.status.capacity.cpu
```
> When specifying multiple columns, avoid spaces.

### Sorting with JsonPath
JsonPath can also be used for sorting results:
```zsh
kubectl get nodes --sort-by=.metadata.name         # Sort nodes by name
kubectl get nodes --sort-by=.status.capacity.cpu   # Sort nodes by CPU capacity
```

## Reference
- [Udemy: Certified Kubernetes Administrator Course](https://samsungu.udemy.com/course/certified-kubernetes-administrator-with-practice-tests)