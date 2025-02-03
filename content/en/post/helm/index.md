---
categories:
  - DevOps
date: 2025-01-30T14:44:49+09:00
draft: false
tags:
  - Helm
title: What is Helm?
---

## Overview
Kubernetes has become an essential technology in modern DevOps by making it easy to deploy, manage, and scale containerized applications.

While Kubernetes offers a wide range of powerful features, managing workloads, services, and persistent volumes (PV/PVC) becomes increasingly difficult as the number of resources grows.

Even deploying a simple WordPress website on Kubernetes requires configuring multiple components:
- Deployment
- Service
- PV
- PVC
- Secret  
  ... and more.

Each of these Kubernetes resources requires a separate YAML file, which must be manually applied using `kubectl apply -f`.  
![](Screenshot%202025-01-30%20at%202.58.15%20PM.png)

> Can't we just manage everything in a single YAML file? 🧐

That’s possible, but when troubleshooting or modifying specific WordPress-related values, searching through a single YAML file with hundreds of lines is not an easy task.

This is where **Helm** comes in! 😇

## What is Helm?
> The package manager for Kubernetes  
But what does that actually mean? 😅

Simply put, Helm allows you to bundle multiple Kubernetes resources (Deployment, Service, PV, etc.) into a single package for easier management.

Without Helm, installing resources in Kubernetes requires running multiple commands:
```zsh
kubectl apply -f service.yaml
kubectl apply -f pv.yaml
kubectl apply -f deployment.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
...
```
With Helm, everything can be installed at once with a single command. Additionally, Helm supports updates, rollbacks, and uninstallation.
```zsh 
helm install [release-name] [chart-name]
# helm install my-site bitnami/wordpress
```
> **Why do we need a release name? Can't we just use the chart name?**  
> `helm install bitnami/wordpress`  
> The release name allows us to deploy multiple instances of the same chart:  
> `helm install my-test-site bitnami/wordpress`  
> `helm install my-real-site bitnami/wordpress`

## Components of Helm

![](Screenshot%202025-02-02%20at%2010.57.09%20PM.png)

- **Helm CLI**
    - A command-line tool used to install, upgrade, and rollback Helm charts.
- **Chart**
    - A collection of files that define Kubernetes resources.
- **Release**
    - The deployed instance of a chart within a Kubernetes cluster.
- **Revision**
    - A snapshot of a release, created whenever changes are made.
- **Secret (Metadata)**
    - Stores release-related information, including changes, as Kubernetes Secrets.
- **Online Chart Repository**
    - A collection of Helm charts, such as [Artifact Hub](https://artifacthub.io/).

## Helm Chart File Structure
Let's take a closer look at Helm charts. Each chart is structured as a directory containing several essential and optional files.

> A Helm chart consists of the following files and directories:
```zsh
<chart-name>/
  Chart.yaml          # Chart metadata (required)
  values.yaml         # Default configuration values (required)
  values.schema.json  # JSON schema to validate values.yaml (optional)
  charts/             # Dependencies (optional)
  crds/               # Custom Resource Definitions (optional)
  templates/          # Kubernetes manifest templates (required)
  templates/NOTES.txt # Installation notes (optional)
  LICENSE             # Chart license (optional)
  README.md           # Chart documentation (optional)
```

### 📁 Key Files
**Chart.yaml (Required)**  
Defines metadata about the Helm chart, such as its name, version, and description.
```yaml
apiVersion: v2
name: my-app
description: A Helm chart for Kubernetes
version: 1.0.0
appVersion: "1.16.0"
```
**values.yaml (Required)**  
Specifies default configuration values. Users can modify this file or override values with the `--set` flag.
```yaml
replicaCount: 3
image:
  repository: my-app
  tag: latest
service:
  type: ClusterIP
  port: 80
```

### 📁 Key Directories

📌 **charts/**  
Stores dependencies for the Helm chart. Running `helm dependency update` will download the required charts into this directory.

📌 **crds/**  
Contains Kubernetes Custom Resource Definition (CRD) files, which are used to define new resource types.

📌 **templates/**  
Includes Kubernetes resource templates. Helm processes these templates using values from `values.yaml` to generate the final manifest files.

📌 **templates/NOTES.txt (Optional)**  
Provides instructions displayed to users after chart installation.

### 🛠️ Summary
- A Helm chart follows a specific directory structure, with `Chart.yaml`, `values.yaml`, and `templates/` being essential components.
- `values.yaml` defines default configurations, while `templates/` dynamically generates Kubernetes manifests.
- Other optional directories like `charts/`, `crds/`, and `values.schema.json` can be included as needed.

Understanding this structure allows you to package and deploy Kubernetes applications efficiently using Helm. 🚀
> For more details, visit [Helm Charts Documentation](https://helm.sh/docs/topics/charts/).

## References
- [Helm Charts Documentation](https://helm.sh/docs/topics/charts/)
- [Certified Kubernetes Administrator Course (Udemy)](https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/)  
