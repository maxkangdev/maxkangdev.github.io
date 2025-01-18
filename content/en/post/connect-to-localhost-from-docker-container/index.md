---
categories:
  - DevOps
date: 2025-01-18T12:48:39+09:00
draft: false
tags:
  - docker
title: Docker Container 내부에서 localhost로 연결하는 방법
---
### Docker Container

Add the following option when running docker container 
```zsh
`--add-host host.docker.internal:host-gateway` 
```

### Docker Compose

add the following code in your docker-compose.yaml under target container
```yaml
extra_hosts:
	- "host.docker.internal:host-gateway"
```


Then, you can call localhost via **host.docker.internal** 🤓

