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

컨테이너 실행할때 아래 옵션을 추가 
```zsh
`--add-host host.docker.internal:host-gateway` 
```

### Docker Compose

docker-compose.yam 에서 원하는 서비스에 아래 코드를 추가 
```yaml
extra_hosts:
	- "host.docker.internal:host-gateway"
```


이렇게 하면 localhost 대신 **host.docker.internal**을 통해 localhost로 통신이 가능하게됨. 🤓