---
categories:
  - network|네트워크
date: 2025-01-26T14:39:08+09:00
draft: false
tags:
  - network
  - docker
title: "[Network] CNI"
---
## Background 

[[Network] namespaces](network-namespaces)   
위 글에서 네트워크 네임스페이스가 어떻게 만들어지고 연결되는지 알아봤습니다. 

1. Create Network Namespace
2. Create Bridge Network/Interface
3. Create VETH Pairs (Pipe, Virtual Cable)
4. Attach vEth to Namespace
5. Attach Other vEth to Bridge
6. Assign IP Address
7. Bring the interfaces up
8. Enable NAT - IP Masquerade 

네트워크는 사실 모든 부분에서 다 사용되기 때문에 도커 뿐만 아니라 다른 컨테이너 관련 솔루션 모두 위와같은 부분을 다 구현해야합니다. 

> 도커, 로켓, 메소스, k8s 등 ... 
![](Screenshot%202025-01-26%20at%202.44.22%20PM.png)

근데 이럴빠에... 누구 한명이 구현해 놓고 그거 가져다가 쓰면 안되나..? 😓 

그래서 그걸 구현한 놈이 있음. -> Bridge 플러그인 
그래서 로켓나 쿠버같은 솔루션에서는 걍 Bridge 써가지고 복잡했던 네트워크 생성 / 연결 등의 작업을 할수 있게되었음. 

> 흠 근데 만약 Bridge말고 따로 구현하려면 어케해야됨? 
> 쿠버나 로켓 같은 솔루션에서 각각 호출 할수 있도록 표준화된 인터페이스 뭐 그런거 없음? 

그게 CNI임 🫠

## CNI (Container Network Interface)
> 컨테이너 간의 네트워킹을 제어할 수 있는 플러그인을 만들기 위한 표준  
> Bridge는 CNI를 구현한 플러그의 예제중 한가지임


CNI는 각각 컨테이너 솔루션과 플러그인에서 구현해야할 인터페이스를 명시하고 있슴. 

### 컨테이너 런타임 책임
- 네트워크 네임스페이스 생성해야함 
- 컨테이너가 연결되어야할 네트워크를 알려줘야함  
- 컨테이너가 추가되었을때 Add 커맨드를 통해 플러그인을 호출해야함 
- 컨에이너가 삭제되었을때 delete 커맨드를 통해 플러그인을 호출해야함 
- JSON 포맷을 이용해 플러그인을 설정해야함 

### 플러그인 책임
- ADD/DEL/CHECK 커맨드를 지원해야함 
- 컨테이너 id, 네트워크 네임스페이스등의 파라미터를 지원해야함
- Pod 별로 IP address를 알아서 지정해주어야하고 컨테이너끼리 통신을 위해 라우팅도 설정해주어야함 
- 특정 포맷으로 결과를 반환해야함 

컨테이너 런타임과 플러그인들이 위 규칙만 지키면 서로서로 갈아끼워서 잘 잘동할 수 있음. 

## 예외 

다 CNI 따르는데 도커만 안따름. CNM (Container Network Model) 이라는 걸 사용함 (걍 CNI랑 비슷한건데 살짝 다른 거라고 보면됨)  

그래서 쿠버네티스에서 도커 사용할때 네트워크로 CNI 구현체를 사용할 수 없음. 
```zsh 
❌ docker run --network=cni-brdige ngix 
```

그렇다고 못쓰는건 아님. 그냥 도커 생성할때 네트워크 지정 안해주고 CNI 플러그인을 따로 호출해주면 됨. 
> 실제로 쿠버에서 도커를 이렇게 쓰고있음
```zsh
docker run --network=none ngix
bridge add 2e34dcf34 /var/run/netns/2e34dcf34
```





