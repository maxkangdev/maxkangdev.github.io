---
categories:
  - network|네트워크
date: 2025-01-25T12:14:57+09:00
draft: false
tags:
  - network
  - linux
title: "[Network] Namespaces"
---
본 글을 도커 네트워크 와 밀접한 관련이 있어서 잘 모르신다면 해당 글을 읽어보고 오면 더 도움이 될 것같습니다 :) [[Docker] Network](docker-network) 
## Namespace란? 
도커 같은 컨테이너들의 경우 실제 컴퓨터(호스트)의 시스템으로 부터 **namespace** 라는 개념을 통해 분리되어서 작동함. 
>Host가 집이라면 namespace는 집안에 있는 방(room) 정도? 

컨테이너는 자신 내부의 process만 볼수 있도록 격리(isolate)되어 있지만, 컴퓨터(Host)는 다 볼 수 있음.  
>이걸 가능케하는게 **namespace** 임

실제로 컨테이너에서 `ps aux` 날리면 내부 프로세스만 보임. 근데 Host에서 `ps aux` 날리면 컨테이너 안에있는거 까지 다보임.   
근데 PID는 둘이 다름. 컨테이너내부에서 실제 PID 말고 내부 기준으로 따로 부여해주기 때문. 
![](Screenshot%202025-01-25%20at%2012.23.02%20PM.png)

## Network Namespace
네트워크또한 Namespace에 따라 분리시켜줄 수 있음. 

호스트의 경우 외부 LAN과 통신하는 인터페이스(eth0) / Routing Table / ARP Table 등 정보를 가지고 있음.     

컨테이너또한 위정보를 공유하지 않고 가상의 인터페이스 (veth0) / Routing Table / ARP Table 을 별도로 가지고 있음. 
![](Screenshot%202025-01-25%20at%2012.29.47%20PM.png)

### Network Namespace 생성 
> 네트워크 인터페이스 두개를 (red & blue) 생성합니다 
![](Screenshot%202025-01-25%20at%2012.31.37%20PM.png)

### Network Namespace 확인 
> 아래 커맨드를 호스트의 interface를 확인하거나, 특정 네임스페이스 내부의 Interface를 확인할 수 있음. 
![](Screenshot%202025-01-25%20at%2012.37.49%20PM.png)

### ARP Table
> 호스트 네트워크의 arp 테이블과 red namespace 네트워크의 arp 테이블을 확인합니다 
![](Screenshot%202025-01-25%20at%2012.37.25%20PM.png)

### Routing Table
> 호스트 라우팅 테이블과 와 red namespace 네트워크의 라우팅 테이블을 확인합니다 
![](Screenshot%202025-01-25%20at%2012.38.08%20PM.png)

## Namespace 간 네트워크 연결하기 
>실제 컴퓨터를 ethernet 케이블로 연결하는 것처럼, virtual ethernet(veth)로 연결함 

1. 먼저 virtual ethernet을 생성함.  
```zsh
# veth-red 와 veth-blue를 연결하는 virtual ethernet cable(or pipe) 생성 
ip link add veth-red type veth peer name veth-blue 
```

2. 각 namespace에 해당하는 Interface를 attach 함 
```zsh 
ip link set veth-red netns red     # veth-red -> red 
ip link set veth-blue netns blue   # veth-blue -> blue 
```

3. 각 interface에 IP 주소 부여 
```zsh
ip -n red addr add 192.168.15.1 dev veth-red     # red namespace 내부 veth-red 에게 192.168.15.1 IP 부여 
ip -n blue addr add 192.168.15.2 dev veth-blue   # blue namespace 내부 veth-red 에게 192.168.15.2 IP 부여 
```

4. 그리고 interface 킴
```zsh 
ip -n red link set veth-red up
ip -n blue link set veth-blue up 
```

이후 아래 커맨드를 통해 arp 조회해보면 정보가 추가된게 보일거임 
```zsh
ip netns exec red arp
ip netns exec blue arp 
```

Ping도 가능 
```zsh
ip netns exec red ping 192.168.15.2
```

하지만 호스트의 arp 테이블을 확인하면 위 해당 정보가 없는 걸 알 수 있음
> 호스트가 필요한게 아니니 당연히 없음 
```zsh 
arp
```

![](Screenshot%202025-01-25%20at%2012.44.12%20PM.png)


## Namespace간 네트워크 연결하기 (3개 이상일 경우)
>장치가 여러개면 저렇게 다 일일히 하기 힘듬... 

실제 네트워크처럼 스위치를 사용해서 연결하며 됨. 다만 여기서 스위치는 **Virtual** 스위치임. 

virtual switch는 Linux Bridge 나 Open vSwitch 등의 관련 솔루션을 이용해야함. 여기선 Linux Bridge 사용해보겠음
> 실제로 도커를 생성하면 자동으로 하나 생기는 네트워크 이름이 bridge인데 docker의 기본 네트워크 드라이버가 Linux Bridge라서 그런거임. 

1.  Virtual Switch 용 인터페이스 생성
```zsh
ip link add v-net-0 type bridge
```

이후 확인해보면 생성된걸 볼 수 있음. 
![](Screenshot%202025-01-25%20at%2012.48.43%20PM.png)

다만 처음에는 꺼져있어서 켜줘야함.
```zsh
ip link set dev v-net-0 up
```

2. Namespace를 virtual switch에 연결 
먼저 원래 만들었던 veth(virtual ethernet)사용 안하니까 지우기 ㄱ 
```zsh
ip -n red link del veth-red     # 둘이 페어기 때문에 하나만 지워도 반대쪽도 같이 사라짐. 
ip -n blue link del veth-blue   # 그래서 요거 안해줘됨. 
```

다음으로 namespace 에서 Bridge로 연결하기 위해 두개의 인퍼테이스를 생성하고 virtual ethernet cable로 연결함 
```zsh
ip link add veth-red type veth peer name veth-red-br # veth-red <-> veth-red-br 
ip link add veth-blue type veth peer name veth-blue-br  # veth-blue <-> veth-blue-br 
```
- `veth-red` 생성될 첫 번째 veth 인터페이스의 이름
- `type veth` 생성할 인터페이스의 유형
- `peer name veth-red-br`  페어의 다른 끝점 이름을 지정

이제 생성된 케이블을 알맞게 부착 
```zsh
ip link set veth-red netns red          # Red namespace 에 부착
ip link set veth-red-br master v-net-0  # Bridge에 부착 

ip link set veth-blue netns blue         # Blue namespace 에 부착 
ip link set veth-blue-br master v-net-0  # Bridge에 부착 
```

3. IP 부여 및 인터페이스 activate 
```zsh
ip -n red addr add 192.168.15.1 dev veth-red
ip -n blue addr add 192.168.15.2 dev veth-blue 
ip -n red link set veth-red up
ip -n blue link set veth-blue up 
```

이러한 방식을 통해 여러 namespace 에서 서로 통신할 수 있도록 설정가능!!!

하지만 이제 Host 에서 해당 network 접근하려고 하면 실패할거임. 왜?? 둘이 다른 네트워크 잖슴. 
#### 그럼 연결하려면 어케해야댐?   

Virtual 스위치(v-net-o)도 생각해보면 그냥 호스트안에 존재하는 network interface임.    

그렇기때문에 걍 해당 interface에 IP 부여해버리고 해당 IP를 통해 접속하면됨. 
```zsh
ip addr add 192.168.15.5/24 dev v-net-0.  # v-net-0 에 192.168.15.5 부여 
```
이제 192.168.15.5 를 통해 연결 가능함. 


#### 🤔 근데 그러면 그 컨테이너들이 속해있는 네트워크에서 바깥 인터넷은 접속 어케해? 

맞음. Host의 ethernet Port만 연결되어있기때문에, 내부 컨테이너 네트워크로는 통신이 불가능함.   
예를들어, 컨테이너 내부에서 `192.168.1.3`에 ping을 날리려하면 다음과 같이 됨.
1. 앵 내부 IP주소`(192.168.15.0/24)` 가 아니네?
2. 라우팅 테이블에서 해당 주소 찾음
3. 없네. GG:) 
그래서 저 라우팅 테이블에 어떻게하면 통신할 수 있는지 Gateway정보를 등록해줘야댐.

그 게이트 웨이가 누구냐? v-net-0 의 정보와 바깥 인터넷 둘다 연결되어 있는 놈이 누구냐? 
바로  `localhost` 임. 그래서 걍 로컬 통해서 가면됨 
```zsh
ip netns exec blue ip route add 192.168.1.0/24 via 192.168.15.5
# 192.168.15.5(virtual switch)를 통해서 192.168.1.0/24 로 가겠다! 
```

이제 Ping 하면 에러 안남. 근데 아직도 response는 못받음...
상대방에 response를 보내려면 IP를 알아야하는데, 내부 네트워크 IP주소를 써버렸으니 제대로 안오는게 당연   

그래서 아래 커맨트를 통해서 해당 내부 네트워크(192.168.15.0)에서 발생해서 밖으로 나가는 통신에 host IP를 사용하도록 설정해주어야함. 
```zsh
iptables -t nat -A POSTROUTING -s 192.168.15.0/24 -j MASQUERADGE
```
이러면 이제 Ping 제대로 될거임 :) 


마지막으로 내부에서 인터넷 연결하려고 하면 안될거임. 아까 라우팅 테이블에 게이트웨이를 192.168.1.0만 등록해서 그런거임. 
그냥 모르는 주소는 무조건 로컬호스트 거쳐서 가겠다라고 default설정 하면 해결됨. 
```zsh
ip netns exec blue ip route add default via 192.168.15.5
```

#### 밖에서는 안으로 통신 가능함? 
ㄴㄴㄴ 개인 네트워크잖음. 안됨. 

그래서 로컬에서 PORT하나 잡아서 그걸 개인 네트워크로 연결되게 해줘야됨 (Port Forwaring).  
그리고 이부분은 방화벽 수정이 필요함 
```zsh
iptables -t nat -A PREROUTING --dport 80 --to-destination 192.168.15.2:80 -j DNAT
# 호스트의 포트 80번으로 오는 모든 요청을 192.168.15.2의 포트 80 으로 보내버리겠다 
```
>Iptables 은 리눅스 기반 OS이 기본으로 딸려있는 방화벽임. 

