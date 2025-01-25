---
categories:
  - DevOps
date: 2025-01-12T22:07:12+09:00
draft: false
tags:
  - network
  - docker
title: "[Docker] Network"
---
## Networking Options
도커 실행시 네트워크 설정에는 몇가지 옵션이 있음

### None 
어느 네트워크에도 연결되어 있지않음. 따라서 외부와 통신불가  
```zsh
docker run Ubuntu --network none 
```
### Host Network
호스트와 연결되어있음. 예를들어 컨테이너를 Port 80 으로 설정해서 띄우면. 로컬호스트 80 으로 해당 웹에 접속이 가능함 
```zsh
docker run Ubuntu --network host 
```

### Bridge (default network driver)
아무것도 설정을 안하면 bridge 네트워크에 연결됨. 
```bash
docker run ubuntu
```

bridge는 docker가 설치되면 자동으로 생성되는 네트워크 드라이버임.  
```zsh
docker network ls
NETWORK ID     NAME      DRIVER    SCOPE
636e8359c29a   bridge    bridge    local
3c867a7aaa82   host      host      local
e47ac0b30be9   none      null      local
```
- 해당 네트워크는 default로 172.17.0.0 주소를 가짐.
- 해당 네트워크에 연결된 device들을 각각 해당 주소안에서 IP를 부여받음 
	- Ex. 172.17.0.2, 172.17.0.3 ...

### user-defined network 
기본적으로 도커는 내부 bridge 네트워크 하나만 생성함. 그렇기 때문에 다음 커맨드로 별도 아이피를 부여받은 네트워크를 생성할 수 있음 
```zsh
docker network create --driver bridge --subnet 182.18.0.0/16 my-network

NETWORK ID     NAME         DRIVER    SCOPE
636e8359c29a   bridge       bridge    local
3c867a7aaa82   host         host      local
24eaacf70800   my-network   bridge    local
e47ac0b30be9   none         null      local
```

해당 네크워크 IP 주소 확인 (Subnet 체크 ㄱㄱ)
```zsh 
docker inspect my-network

[
    {
        "Name": "my-network",
        "Id": "24eaacf70800544ec3ce67c089a8f9bd641d25a91970c23835187e38f9bbbdc8",
        "Created": "2025-01-24T07:53:24.880072262Z",
        "Scope": "local",
        "Driver": "bridge",
        "EnableIPv6": false,
        "IPAM": {
            "Driver": "default",
            "Options": {},
            "Config": [
                {
                    "Subnet": "182.18.0.0/16"
                }
            ]
        },
        "Internal": false,
        "Attachable": false,
        "Ingress": false,
        "ConfigFrom": {
            "Network": ""
        },
        "ConfigOnly": false,
        "Containers": {},
        "Options": {},
        "Labels": {}
    }
]
```

이후 같은 네트워크에 있는 컨테이너끼리는 IP 혹은 컨테이너 이름으로 서로를  통신할수 있음.  
> 도커 내부에 built-in DNS 서버가 있어서 가능함. 서버 주소 127.0.0.11 로 고정됨. 



