---
categories: 
date: 2025-01-12T22:07:12+09:00
draft: true
tags: 
title: docker-network
---
도커 네트워크에 대해서 간단하게 알아보자.

## Networking Options

도커 실행시 네트워크 설정에는 몇가지 옵션이 있음

### None 
```zsh
docker run --network none ngix
```
어느 네트워크에도 연결되어 있지않음. 따라서 외부와 통신불가

### Host Network
```zsh
docker run --network host nginx
```
호스트와 연결되어있음. 예를들어 컨테이너를 Port 80 으로 설정해서 띄우면. 로컬호스트 80 으로 해당 웹에 접속이 가능함 

### Bridge 
- Private 네트워크를 생성하고, 해당 네트워크에 컨테이너와 호스트가 연결됨.   
- 해당 네트워크는 default로 172.17.0.0 주소를 가짐.
- 해당 네트워크에 연결된 device들을 각각 해당 주소안에서 IP를 부여받음 
	- Ex. 172.12.0.2, 172.12.0.3

일단 docker가 설치되면 bridge 라는 네트워크가 생성됨.  
```zsh
docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
636e8359c29a   bridge    bridge    local
3c867a7aaa82   host      host      local
e47ac0b30be9   none      null      local
```

도커에서는 bridge라고 부르지만, 호스트는 docker0 라고 부름. 또한 Docker는 컨테이너가 마다 network namespace 를 생성함. 
```zsh
ip link # docker0 확인 
ip addr # docker0 에 172.17.0.1 할당 확인 
ip netns # 도커가 생성한 네트워크 네임스페이스들 확인 
```
#### Docker는 그럼 어떻게 컨테이너(network namespace)를 bridge에 갖다가 붙힘? 

[linux-networking-basics](linux-networking-basics/index.md) 의 Network Namespaces에서 나온 것처럼, Docker에서 두 인터페이스를 연결해줌 

```
ip nets
ip link 
ip -n <namespace> link 
```






