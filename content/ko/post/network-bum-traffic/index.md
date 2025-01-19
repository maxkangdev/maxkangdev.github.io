---
categories:
  - network|네트워크
date: 2025-01-19T14:34:27+09:00
draft: false
tags:
  - network
title: "[Network] BUM Traffic - Broadcast, Unknown Unicast, and Multicast"
---
## BUM, stands for 
- Broadcast
- Unknown unicast
- Multicast 

## Broadcast 
네트워크에서 데이터를 **모든 장치**에게 동시에 전송하는 방식임   

예제를 통해 알아보자 -> ARP
### ARP, Address Resolution Protocol
IP와 연결된 Mac Address를 알아내기위한 `Broadcast`

아래 그림에서 Computer1 에서 Computer2로 통신을 하려한다 가정해보자.    
만약 Computer2의 IP는 아는데, Mac Address를 모르는 경우 어떻게함?   

LAN에서는 Mac Address로 통신하는 거라서, Mac모르면 통신을 몬함...🧐 
![](Screenshot%202025-01-19%20at%202.38.20%20PM.png)

ARP 를 사용해서 알아내면 됨  
1. Computer1이 ARP Request를 브로드 캐스팅함. 
2. 스위치에서는 해당 request를 받아서 LAN내 모든 기기에게 해당 요청을 보냄 (Broadcast니깐).
	- 야.. 요 IP 주인 누구냐? 나와라 😤
3. IP 주인(Computer2)이 어 이거 나네?? 하고 Mac Address가 보함된 ARP response를 보냄
4. 이후 Computer1이 해당 정보를 받아서 내부 ARP 테이블 정보를 업데이트함. 
5. 이후 해당 Mac Address를 사용해서 Unicast를 보낼 수 있음 :) 

>Try `arp -a` to see ARP table info 

## Unknown Unicast 
수신자가 **알려지지 않은** 경우 발생하는 패킷 전송 방식

요것도 예제로 이해해보자. 
### 2개이상의 스위치가 연결된 경우 
아래처럼 스위치를 연결해서 쓰는 경우가 있다.  (aka switch link or daisy chaining)

여튼, Computer1에서 Computer3로 데이터를 전달하려한다 해보자. 

Switch1 
- 엥... 난 Mac3 모르는디..?😓   <- 요게 Unknown unicast임 

![](Screenshot%202025-01-19%20at%202.54.25%20PM.png)

다음과 같은 방식으로 해결됨.
1. Switch1 이 해당 요청을 모든 port로 보내버림 
2. Switch2 를통해 Computer3 에 도달해서 response를 받음
3. 아 Switch2에 연결된 Port로 통신이 되는걸 확인함 
4. Mac Table을 업데이트함. 

## Multicast 
**특정 그룹의 수신자**에게 데이터를 전송하는 방식 (1 to many)

예를들어 Computer1 이 Computer3,4 에게만 데이터를 보내는걸 Multicast라고함. 