---
categories:
  - devops
date: 2025-01-12T12:09:56+09:00
draft: true
tags:
  - network
  - linux
title: Linux 네트워크 기본 지식
---
## Switching 

컴퓨터가 두대 (A 와 B) 있다고 가정해보자. 노트북이 될 수 도 있고, VM이 될 수 도 있다. 

#### 이때 A 가 B로 어떻게 통신하냐?! 

스위치를 통해 연결함. 두 컴퓨터를 스위치로 연결하게되면, 스위치가 두 컴퓨터를 포함한 네트워크를 생성함.  
각 컴퓨터를 스위치로 연결하려면 인터페이스를 통해 연결해야함. 아래 커맨드로 인터페이스 정보를 확인할 수 있음. 

`ip link`  Show information for all interfaces 
```zsh 
ip link show dev em1  # Display information only for device em1 

ip link set em1 up         # Bring em1 online 
ip link set em1 down       # Bring em1 offline 
ip link set em1 mtu 9000   # Set the MTU on em1 to 9000 
ip link set em1 promisc on # Enable promiscuous mode for em1
```
>mtu(maximum transmission unit)
>**the largest size frame or packet -- in bytes or octets (eight-bit bytes) -- that can be transmitted across a data link**

이후 인터페이스를 확인했다면, 인터페이스중 하나를 스위치에 연결해야함.   
아래 커맨드중 `ip addr add`를 사용해서 연결할 수 있음. 

`ip addr` Show information for all addresses
```zsh
ip addr show dev em1               # Display information only for device em1

ip addr add 192.168.1.1/24 dev em1 # Add address 192.168.1.1 with netmask 24 to device em1
ip addr del 192.168.1.1/24 dev em1 # Remove address 192.168.1.1/24 from device em1
```

예를들어, A 와 B가 em1 인터페이스를 통해 스위치와 연결하려면 아래 커맨드를 통해서 연결하면 되는 거임 
```zsh
ip addr add 192.168.1.10/24 dev em1 
# (A) Add address 192.168.1.1 with netmask 24 to device em1

ip addr add 192.168.1.11/24 dev em1 
# (B) Add address 192.168.1.1 with netmask 24 to device em1
```

![](Screenshot%202025-01-12%20at%2012.20.44%20PM.png)

이렇게 되면 이제 A랑B는 통신이 가능하게됨. (핑 날려보면 Response 받음)

#### 그러면 다른 네트워크에 있는 컴퓨터에 연결하려면 어케함?

## Routing 

예를 들어, 아래 그림처럼 B 에서 C로 통신하려한다면?! 
![](Screenshot%202025-01-12%20at%2012.23.16%20PM.png)

그때 필요한게 바로 **라우터**임.  
라우터는 두개의 네트워크를 연결하는 것을 도와줌. 네트워크 포트가 여러개 달린 서버라고 생각하면됨.  
여러개의 네트워크에 동시에 연결되기 때문에 위 그럼처럼 ip도 여러개 가지고 있음 (네트워크당 하나씩). 

근데 라우터도 그냥 Ip주소 하나 가지고 있는 서버나 마찬가지고, 또 여러 라우터들이 있을 수 있는 건데 통신할때 언놈이 라우터고 또 어디로 가야되는지 어케앎?
## Gateway

그 때 사용하는게 Gateway(혹은 Route)임.
> 네트워크가 방이면, Gateway는 문이라고 생각하면 됨. 
> 그렇기 때문에 시스템에서는 문이 어딘지 알아야 됨. 그래야 뭐 어딜 가든 할거아녀 🏃‍♂️

시스템의 이러한 정보를 알려면 다음 커맨드를 사용하면됨.  -> `route` (`netstat -nr` in Macos)
만약 설정이 안되어있으면 B에서 C로 통신 못하는 거임. 

설정을 위해서는 아래 커맨드를 사용해 Route을 등록해주어야함. 위 그럼을 예제로 들자면, 아래와 같음. 
```zsh
# 192.168.1.1 을 통해 192.168.2.0/24 로 가겠다! 
# ip route add <destination> via <Gateway>
ip route add 192.168.2.0/24 via 192.168.1.1 
```

`ip route`  List all of the route entries in the kernel
```zsh 
ip route add default via 192.168.1.1 dev em1 
# Add a default route (for all addresses) via the local gateway 192.168.1.1 that can be reached on device em1

ip route add 192.168.1.0/24 via 192.168.1.1 
# Add a route to 192.168.1.0/24 via the gateway at 192.168.1.1
ip route add 192.168.1.0/24 dev em1         
# Add a route to 192.168.1.0/24 that can be reached on device em1
```

#### 그럼 인터넷으로는 어케 연결하는거임? 

![](Screenshot%202025-01-12%20at%2012.42.48%20PM.png)

이것도 위랑 동일함. 인터넷의 IP가 172.217.194.0 이라 하면 아래처럼 설정해주면됨. 
```zsh
# 192.168.2.1 를 통해 172.217.194.0 (인터넷)으로 가겠다!  
ip route add 172.217.194.0 via 192.168.2.1
```


#### 아니 근데 웹사이트가 개많자나!! 그걸 다 일일히 한다고?! 😡

ㄴㄴ
그럴때마다 등록하기보다는 아래처럼 걍 Default로 박아 버리면됨. 

```zsh
# 내부 네트워크도 아니고 Routing 설정도 따로 안된 IP들에 대해서는 걍 얘 쓸게...
ip route add default via 192.168.2.1
```

그리고 default 대신 `0.0.0.0` 사용해도됨.    
`0.0.0.0` == Any IP destination 이라는 뜻임.

만약 Gateway 가 0.0.0.0 으로 설정되어 있다는 거는, Gateway가 필요없다는 거임.  
어떤 경우임? -> 같은 네트워크 안에 경우에 존재하는 경우지. 


### 라우터가 두개 이상인 경우 

두개인 경우를 가정해봄 
- 하나는 인터넷 연결용
- 하나는 내부 개인 네트워크 연결용.

그럴때는 Gateway또한 두개 이상 필요
- 인터넷 연결용 Gateway 
- 내부 네트워크 연결용 Gateway 


## Linux를 Router 로 사용하는 방법 

아래와 같은 셋업이 되어있는 경우, A -> B 로 통신을 어케함? 
![](Screenshot%202025-01-12%20at%2012.58.18%20PM.png)
먼저 A 에서 `ping 192.168.2.5` 날려봤자 무용지물임. 때문에 아래와 같이 설정을 해줘야함 
```zsh
# 192.168.1.6 Gateway를 통해 192.168.2.0 네트워크에 접속 하겠다. 
ip route add 192.168.2.0 via 192.168.1.6
```

근데 이렇게만 하면 C -> A로 통신할때 똑같은 문제가 생김. 그래도 C에도 비슷한 설정해줘야함 
```zsh
# 192.168.2.6 Gateway를 통해 192.168.1.0 네트워크에 접속 하겠다. 
ip route add 192.168.1.5 via 192.168.2.6
```
이러면 ping 성공 😆 이 아니라 실패함 ㅋ 😵‍💫  
에러는 발생안해서 제대로 동작은 하는데, response를 못받음.  

**왜 와이?**   
Linux에서 패킷은 인터페이스를 통해 전달되지 않음.  
예를들어 B의 `eth0`로 패킷이 전달된 경우, 해당 패킷은 `eht1` 포함한 다른 인터페이스로 나가지 않음. 

**왱?**
보안 문제 땜시 그럼.   
예를 들어, `eth0`가 내부네트워크에 연결되고, `eht1`이 외부 공공네트워크로 연결된 상태일때 `eth1`을 통해서 온 값이 `eth0`를 타고 내부 네트워크로  
쉽게 흘러 들어가는 것을 방지하고 싶은거지.   

물론 설정으로 가능하게 만들 수 있음. 둘다 내부 네트워크면 상관없자나?   
해당 설정을 아래 파일에 저장되어있음.
```zsh
cat /proc/sys/net/ipv4/ip_forward
0
```
기본으로 0 으로 되어있는데 요걸 1 로 바꾸면 ping했을때 Response 받는 것을 볼 수 있을거임. 

근데 컴터 껏다 키면 다시 0 으로 리셋되니까, 아래 파일에 설정해줘야함. 
```zsh
# /etc/sysctl.conf 
net.ipv4.ip_forward=1
```


## DNS 

IP 외우기 너무 힘든데 걍 다르게 부를수 있는 방법 없음?   
있음 ->DNS(Domain Name System). 

/etc/hosts 파일을 수정하여 간단하게 설정이 가능함.  
```zsh 
# /etc/hosts 
192.168.1.11    db 
```
위 처럼 하게 되면 `ping 192.168.1.11`  대신 걍 `ping db` 해도됨.  (ssh, curl, ... 등 사용가능). 

이렇게 /etc/hosts 에 IP와 매핑되는 이름을 등록하는 방식을 **Name Resolution** 이라고함.
물론 아래처럼 컴퓨터가 많이 없는 경우는 이렇게들 해왔었음. 
![](Screenshot%202025-01-12%20at%201.45.21%20PM.png)

#### 근데 컴퓨터가 점점 많이 진다고 생각해봐.... 

관리하기가 어렵기 시작해짐...  
아래 컴퓨터 주소 하나만 바껴도, 나머지 컴퓨터들 모두의 /etc/hosts 파일을 수정해야됨... 
![](Screenshot%202025-01-12%20at%201.46.07%20PM.png)

그래서 다들 각자 관리하기 보다는, 공통 **DNS서버**를 두어서 해당 서버를 통해서 Name Resolution을 진행하도록 변경함.   
근데 그걸 어케함?   

아래 그림처럼 DNS Server가 192.168.1.100 의 IP가지고 있다면, 각 호스트의 /etc/resolv.conf 파일에  다음과 같이 등록하면 됨.  
```zsh 
# /etc/resolv.conf
nameserver    192.168.1.100
```
이렇게 등록될시, 각 호스트에서 모르는 경우 hostname을 맞닥뜨릴경우, DNS Server를 통해 해당 hostname을 조회하도록 설정됨.   
이러면 호스트 IP 주소가 바뀌어도, DNS서버만 업데이트 하면됨 😆
![](Screenshot%202025-01-12%20at%202.10.04%20PM.png)

만약 같은 이름의 hostname이 로컬 과 DNS 서버에 둘다 등록되어 있다면 로컬이 우선순위를 가지게됨. 
아래 파일에 그 설정이 명시되어 있는데, dns files로 순서를 바꾸면 DNS 서버가 우선순위를 가짐.
```zsh
# /etc/nsswitch.conf
...
hosts:    files dns 
```

또한 여러개의 DNS 서버를 추가할수 있음
```zsh 
# /etc/resolve.conf
nameserver 192.168.1.100
nameserver 8.8.8.8  # common well known DNS server hosted by google that knows all the websites in the internet
```
근데 이러면 또 전처럼 새로운 DNS 서버 추가될 때마다 호스트마다 다 /etc/hosts를 건드려야하니까  
DNS 서버에서 모르는 이름있으면 다른 DNS 서버로 해당 요청을 할 수 있도록 해줄 수 있음. 

## Domain Names
www.google.com 요런게 도메인 이름임이고 다음과 같은 형태로 이루어져 있음
- `.` Root
- `.com` Top Level Domain Name
- `google` Domain name 
- `www` Subdomain 
	- 해당 도메인 서비스를 조금더 세분화 해주기 위해 사용됨 
	- `mail`(Gmail), `map`(Google maps) etc ....

**그럼 사내환경 에서 `apps.google.com` 을 호출하면 무슨 일이 일어나냐?** 

1. 먼저 사내 DNS 서버 (Org DNS) 한테 `apps.google.com` IP 물어봄 
2. 사내 DNS 서버는 모르니까 공공 DNS서버에 물어봄. 여러 DNS 서버들을 거치겠지만 한가지 예를 들면
	1. `Root DNS` 가 해당 요청을 보고 `.com DNS` 한테 물어봄
	2. `.com DNS`도 몰라서 `Google DNS`한테 물어봄 
	3. `Google DNS` 가 IP 알려줌
3. 사내 DNS 서버가 드디어 IP 받아서 알려줌.
*추가로 사내 DNS 서버가 해당 정보를 cache 할거임. 아마도... 구글이자나...*

**그럼 구글에서 일하는 사람들도 apps.google.com으로 들어감?**

내가 구글안다녀서 모르겠는데 🤔 안그런다고 가정해보겠음. 구글 직원이라면 걍 apps로 들어갈수 있어야 하는거 아니누?! 
아래 처럼 설정해두면 Name Resolution 된거 뒤에 추가로 search 이름을 붙여서 요청을 알아서 해줌. 
```zsh
# /etc/resolve.conf
nameserver 192.168.1.100
search google.com 
```
`ping apps` -> `ping apps(.google.com)`

**그러면 `ping apps.google.com` -> `ping apps.google.com(.google.com)` 아님?!?!**  
개발자들이 그렇게 몽총하지는 않습니다... 그건 알아서 잘 처리해줍니다 😝  

또한 아래 처럼 여러개 지정해두면 둘다 찾아봄 
```zsh
search google.com dev.google.com 
```

## Record Types 

DNS 서버에 저장되는 정보는 대표적으로 세가지가 있음. (더 많긴한데... 이정도만 알아도 충뷴)
- A 
	- hostname : IP 
	- Ex. web-server : 192.168.1.1
- AAAA
	- hostname : IPv6
	- Ex. web-server: 2001:0000:130F:0000:0000:09C0:876A:130B
- CNAME
	- hostname : another hostname
	- 같은 사이트에 다른 이름 쓰고 싶을때 쓸 수 있음
	- food.web-server : eat.web-server, hungry.web-server 


## Network Namespaces

도커 같은 컨테이너들의 경우 실제 컴퓨터(호스트)의 시스템으로 부터 **namespace** 라는 개념을 통해 분리되어서 작동함. 
> Host가 집이라면 namespace는 집안에 있는 방(room) 정도? 

컨테이너는 자신 내부의 process만 볼수 있도록 격리(isolate)되어 있지만, 컴퓨터(Host)는 다 볼 수 있음.  
이걸 가능케하는게 **namespace** 임

실제로 컨테이너에서 `ps aux` 날리면 내부 프로세스만 보임. 근데 Host에서 `ps aux` 날리면 컨테이너 안에있는거 까지 다보임.   
근데 PID는 둘이 다름. 컨테이너내부에서 실제 PID 말고 내부 기준으로 따로 부여해주기 때문. 

#### 그럼 컨테이너 네트워크는?
![](Screenshot%202025-01-12%20at%204.29.47%20PM.png)

위에서 쭉 읽었으면 알겠지만, Host는 이것저것 해서 Network Interface가 설정이 되어있음. 
하지만 컨테이너는 격리되어 생성되기 때문에 Host의 네트워크에 대한정보가 없고 대신 고유의 네트워크(Virtual Network Interface) 가지게됨. 

현재 Linux 시스템의 네트워크 정보를을 보려면 아래 커맨드실행 ㄱㄱ
```zsh
ip netns add red    # Create network called red    
ip netns add blue   # Create network called blue 
ip netns # list existing network 
```

네트워크 인터페이스 정보를 보려면 아래 커맨드 ㄱㄱ 
```zsh
ip link  # 호스트 네트워크 인터페이스 정보 

# 특정 네트워크 내 인터페이스 정보 (red)
ip netns exec red ip link  
=
ip -n red link 

# 특정 네트워크 내 인터페이스 정보 (blue)
ip netne exec blue ip link
=
ip -n blue link 
```

ARP Table 이랑 Routing 테이블도 동일함 
```zsh
arp      # 호스트 address resolution protocols 정보 

ip netns exec red arp 
ip netns exec blue arp 

route    # 호스트 라우팅 테이블 정보 

ip netns exec red route
ip netns exec blue route 
```

#### 그럼 컨테이너 네트워크끼리는 어케 연결함? 

실제 컴퓨터를 ethernet 케이블로 연결하는 것처럼, virtual ethernet(veth)로 연결함 

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

####  3대..4대..여러개면 다 이렇게 해줘야댐..?

ㄴㄴ...  찐 네트워크처럼 스위치를 사용하면됨. 다만 이번에도 virtual을 곁들인...  

virtual switch는 Linux Bridge 나 Open vSwitch 등의 관련 솔루션을 이용해야함. 여기선 Linux Bridge 사용해보겠음 

1.  Virtual Switch 용 인터페이스 생성
```zsh
ip link add v-net-0 type bridge
```
`ip link` 를 통해 제대로 생성되었는지 확인할 수 있음. 다만 처음에는 꺼져있어서 켜줘야함.
```zsh
ip link set dev v-net-0 up
```

2. Namespace를 virtual switch에 연결 
먼저 원래 만들었던 veth(virtual ethernet)사용 안하니까 지우기 ㄱ 
```zsh
ip -n red link del veth-red     # 둘이 페어기 때문에 하나만 지워도 반대쪽도 같이 사라짐. 
ip -n blue link del veth-blue   # 그래서 요거 안해줘됨. 
```

다음으로 namespace 에서 Bridge로 연결하기 위해 virtual ethernet cable을 생성 
```zsh
ip link add veth-red type veth peer name veth-red-br # veth-red <-> veth-red-br 을 연결해주는 네트워크 인터페이스 생성 

ip link add veth-blue type veth peer name veth-blue-br  # veth-blue <-> veth-blue-br 을 연결해주는 네트워크 인터페이스 생성
```

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

하지만 이제 Host 에서 해당 network 접근하려고 하면 실패할거임. 왜?? 둘은 어차피 나눠진 네트워크라서임. 
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

그래서 로컬에서 PORT하나 잡아서 그걸 개인 네트워크로 연결되게 해줘야됨 (Port Forwaring)
```zsh
iptables -t nat -A PREROUTING --dport 80 --to-destination 192.168.15.2:80 -j DNAT
# 호스트의 포트 80번으로 오는 모든 요청을 192.168.15.2의 포트 80 으로 보내버리겠다 
```


일단 이정도가 Linux Network 관련되서 알아두면 좋음 


Reference
https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/