---
categories:
  - network|네트워크
date: 2025-01-19T12:18:05+09:00
draft: false
tags:
  - network
title: "[Network] LAN 에서 Hubs, Bridges, Switches"
---
## Hub
- 여러 장치들이 연결될 수 있도록 돕는 장치
- 허브는 데이터를 받은 후, 이를 네트워크에 연결된 모든 장치에게 전달함
### 특징
- 단순함
- 여러장치가 동시에 데이터를 전송하면 충돌이 발생함
- 보통 스위치나 라우터 같은 고급장치로 대체되서 요즘은 거의 안쓰임. 
![](Screenshot%202025-01-19%20at%2012.24.02%20PM.png)
## Bridge 

- 두 개 이상의 네트워크 세그먼트(Hub)를 연결하는 장치
- 브리지는 네트워크를 물리적으로 분리된 세그먼트로 나누면서, 각 세그먼트 간의 데이터 흐름을 제어함 
- 주로 **LAN(Local Area Network)** 에서 사용되며, 트래픽이 불필요하게 네트워크 전체로 퍼지지 않도록 제한함 
### 특징 
- **필터링**
	- 브리지는 데이터를 받을 때, 그 데이터를 목적지 MAC 주소에 따라 전달하거나 차단함
	- 즉, **필터링** 기능을 제공하여, 필요한 데이터만 전달하고 불필요한 데이터는 차단함 
	- 이를 통해 네트워크의 효율성을 높일 수 있음
- **충돌 도메인 분리**
	- 허브와 달리, 브리지는 충돌 도메인을 분리함 
	- 즉, 네트워크의 각 세그먼트에서 발생하는 충돌을 독립적으로 관리하므로 네트워크 성능을 향상시킬 수 있습니다.

![](Screenshot%202025-01-19%20at%2012.29.45%20PM.png)

## Switch 
- 여러 장치들 간의 데이터 통신을 관리하고, 데이터를 효율적으로 전달하는 역할을 함. 
- 스위치는 **스마트 허브**라고 할 수 있으며, 허브와 달리 **목적지 주소(MAC 주소)**에 따라 데이터를 정확한 장치로 전송함
- 스위치는 주로 **이더넷 네트워크**에서 사용되며, LAN(Local Area Network) 내에서 중요한 역할을 함 
### 특징
- **패킷 전송 효율성**
	- 스위치는 데이터를 받은 후, 그 데이터를 목적지 장치의 MAC 주소에 맞게 전달함
	- 즉, 데이터를 네트워크 상의 특정 장치로만 전송하여 불필요한 트래픽을 줄이고, 네트워크 효율성을 높임 
	- 이 방식은 **포인트 투 포인트(point-to-point)** 통신처럼 동작함 
- **충돌 도메인 분리**
	- 스위치는 각 포트마다 별도의 **충돌 도메인**을 만들어, 네트워크 내에서 충돌을 줄이고, 성능을 향상시킴. 
	- 여러 장치가 동시에 데이터를 보내더라도 서로 간섭하지 않고 독립적으로 통신할 수 있음 
  - **MAC 주소 학습**
	  - 스위치는 **MAC 주소 테이블**을 이용해, 네트워크 장치들의 MAC 주소를 학습함
	  - 이를 통해 어떤 포트로 어떤 장치가 연결되어 있는지 파악하고, 데이터를 해당 포트로만 전송할 수 있게 됨 

### Switch vs Hub
- **허브**는 데이터를 받은 후, 이를 네트워크의 모든 포트로 전송하지만, **스위치**는 데이터를 정확한 목적지 포트로만 전달하여 네트워크 효율을 높임 
- **허브**는 하나의 충돌 도메인 내에서 모든 장치가 데이터를 공유하므로 성능이 떨어질 수 있는데, **스위치**는 각 포트가 독립적인 충돌 도메인을 가지기 때문에 성능이 개선됨 

## Broadcast Domain 
- 브로드캐스트 패킷이 전송될수 있는 범위를 뜻함
- 만약 LAN에 있는 모든 컴퓨터에게 데이터를 전달하고 싶다면? 스위치에 브로드캐스트 패킷을 전달하면됨. 
	- 따라서, **스위치에 연결된 모든 장치 = 브로드 캐스트 도메인** 

### L2 Segment 
- **데이터 링크 계층(Layer 2)**에서 정의된 네트워크 세그먼트 
- L2 세그먼트 내의 장치들은 서로 **MAC 주소**를 통해 통신함 
- 따러서 L2 Segment = 브로드 캐스트 도메인 이라고 볼 수 있음. 

### 문제
- Broadcast Domain(L2 Segment)에 장치들이 많아지면 많아질수록 다음과 같은 이유때문에 네트워크 성능이 떨어짐
	- 브로드 캐스트 트래픽 증가
	- 성능 저하
	- 충돌 도메인 확장 
	- 네트워크 관리 어려움 
### 해결책 
- 네트워크 분할
- VLAN
- 라우터 사용 

위 토픽(해결책)에 대해서는 별도로 Post를 작성하겠음 :) 
