---
categories:
  - network|네트워크
date: 2025-01-19T15:04:03+09:00
draft: false
tags:
  - network
title: "[Network] Routers"
---
## 개요 

LAN에서 스위치만 있으면 괜찮은거 아님? 왜 라우터까지 필요함?   
요거 읽어보면 왜 필요한지 앎-> [[Network] LAN 에서 Hubs, Bridges, Switches](network-hub-bridges-switches)

간단하게 말하면, 스위치에 연결된 기기들이 늘어날수록 속도랑 효율이 떨어짐 😵‍💫   
그래서 네트워크를 쪼개야되는데 그때 필요한게 라우터임. 

## Router 
라우터를 놓음으로서 LAN이 두개로 분리됨. 
이렇게 되면 다음과같은 장점이 생김
- Broadcasting Domain이 반으로 줄어버림 (각 Segment내부에서 broadcast됨)
- Switch에서 각 Segment만 알면되니, Mac Address 테이블이 더 작아짐. 
![](Screenshot%202025-01-19%20at%203.23.35%20PM.png)

그럼 이제 Computer1 -> Computer3로 통신은 어케함? 

Network Interface & Default Gateway개념을 통해 통신함 
### Network Interface
- 라우터가 다른 네트워크와 통신하기 위해 사용하는 물리적 또는 가상 연결포트임. 
- 여러개를 가질 수 있음.
- 그리고 해당 인터페이스에 IP 가 할당됨. 

Ex. 위 그림을 예로 들어보면 라우터는 두개의 Network Interface를 가지고 있음 
1. Segment 1 에 연결된 Interface
2. Segment 2 에 연결된 Interface 
그리고 각 인터페이스는 10.1.1.1 과 10.1.1.2 IP를 가지고 있다고 가정하겠음. 

>추가로 Router도 기기이기 때문에 고유의 Mac Address를 당연히 가지고 있음. 그리고 Switch의 한 포트에 연결되어있음.

### Default Gateway
네트워크 장치가 **자신의 네트워크 외부로 데이터를 전송**할 때 사용하는 **기본 출입점**(즉, 기본 라우터)

다시 본질문으로 돌아와서, 위 그림에서 Computer1 에서 Computer3로 어케 통신하냐?  

1. Computer3로 데이터를 전송하기 위해 10.1.2.13를 타겟 IP로 설정하고 데이터를 보냄. 
2. 컴퓨터 - 앵? 근데 10.1.2 는 우리 LAN=Segment 1이 아니자나? 
3. 컴퓨터 - 그럼 우리 네트워크에 없다는 소리니까 라우터한테 보내서 알아서 처리해달라하자. 
4. 컴퓨터 - 라우터 주소가 뭐더라... 
	1. 라우터 주소 = Default Gateway 임.
	2. 본 예제에서는 Segment1 에 연결된 Interface = 10.1.1.1
5. 라우터에 해당 데이터를 보냄
6. 라우터 10.1.2.13? 요건 Segment 2이 있는 놈 이네. ㅇㅋ 글로 보내줌
7. Segment 2에 연결된 Interface를 통해서 데이터를 스위치로 보내고, Computer 3로 해당 데이터가 도달함. 

> try `route -n get default` to see default gateway IP address 