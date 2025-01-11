---
categories:
- devops
date: "2024-12-21T16:38:43+09:00"
draft: false
tags:
- kubernetes
title: '[Kubernetes] Commands & Arguments'
---



### ENTRYPOINT vs CMD in Docker

**CMD**
- provides the default command to execute when a container starts
- overridable
- used for providing defaults that are expected to change

**ENTRYPOINT**
- defines the command that will **always** be executed when the container starts
- not easily overridable
    - use `--entrypoint` if necessary
    - used when you want to ensure that a specific command is always executed and cannot be overridden

### Examples 

```yaml
# Dockerfile (CMD only) 
FROM ubuntu
CMD ["sleep","5"] # O
CMD ["sleep 5"]   # X 
---

🚫 docker run ubuntu 10         # 10 
✅ docker run ubuntu sleep 10   # sleep 10 
✅ docker run ubuntu            # sleep 5
```

```yaml
# Dockerfile (ENTRYPOINT only) 
FROM ubuntu
ENTRYPOINT ["sleep"]
---

✅ docker run ubuntu 10        # sleep 10
🚫 docker run ubuntu sleep 10   # sleep sleep 10 
🚫 docker run ubuntu            # sleep 
✅ docker run --entrypoint sleep2.0 ubuntu 10   # sleep2.0 10
```

```yaml
# Dockerfile (ENTRYPOINT & CMD) 
FROM ubuntu
ENTRYPOINT ["sleep"]
CMD ["5"]
---

✅ docker run ubuntu 10         # sleep 10
🚫 docker run ubuntu sleep 10   # sleep sleep 10 
✅ docker run ubuntu            # sleep 5
✅ docker run --entrypoint sleep2.0 ubuntu 10   # sleep2.0 10
```


### ENTRYPOINT & CMD in k8s

In k8s,   
**command** = ENTRYPOINT & **args** = CMD

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ubuntu
spec:
  containers:
  - name: ubuntu
    image: ubuntu
    command: ["sleep2.0"] # ENTRYPOINT
    args: ["10"]          # CMD
```