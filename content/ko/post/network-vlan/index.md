---
categories:
  - network|네트워크
date: 2025-01-19T21:32:20+09:00
draft: false
tags:
  - network
title: "[Network] VLAN"
---

## 개요 

회사가 여러 부서로 나누어져있다고 가정해보자.  
그렇다면 부서별로 업무가 다르고 네트워크 정책같은 부분들이 다를 수 있기때문에 LAN을 구별해서 사용해야한다.  

### 물리적 분리 (Physical Separation)  
그럼 아래처럼 간단하게 물리적으로 분리하면 된다. 이후 라우터에 정책을 적용해서 관리해주면 됨.   
![](Screenshot%202025-01-19%20at%209.21.36%20PM.png)

**하지만 이렇게 되면, 다음과 같은 문제가 발생한다.** 
- 부서가 늘어날때마다 스위치를 추가로 구매해야함
- 스위치갯수가 늘어날때마다 관리영역도 같이 늘어남.
	- 스위치다 관리해줘야되자나.... so 귀차나...

### 논리적 분리 (Logical Separation)  
스위치 걍 하나두고 그냥 분리된것 처럼 관리해!  
![](Screenshot%202025-01-19%20at%209.26.05%20PM.png)

이걸 가능케 하는게 바로 VLAN, Virtual Local Area Network 임. 

## VLAN (Virtual Local Network)
VLAN(Virtual Local Area Network)은 하나의 물리적인 네트워크를 논리적으로 분리하여 여러 개의 네트워크처럼 동작하게 만드는 기술임

### 특징
- **포트 기반 분리**  
	- VLAN은 스위치의 포트를 기준으로 네트워크를 나눔
	- 예를 들어, 포트 1-10 은 VLAN 10, 포트 2-20은 VLAN 20으로 설정하면 서로 다른 VLAN에 속한 기기들은 서로 통신할 수 없음
	- 통신하려면 라우터를 거쳐서 통신이 가능함 
- **프레임 태깅(802.1Q 표준)**  
	- VLAN을 구분하기 위해 **802.1Q 태그**라는 방식으로 네트워크 프레임에 VLAN ID를 추가함
	- 각 프레임에 VLAN 태그(12비트)가 추가되어 어떤 VLAN에 속한 데이터인지 구분함
	- VLAN 태그가 없는 일반 데이터는 "기본 VLAN"으로 처리됨 
### 구성
- **액세스 포트 (Access Port)**
	- 특정 VLAN에 고정적으로 연결된 포트
	- 예: 부서별 PC, 프린터 등은 특정 VLAN에 속하도록 설정
	- Access 포트는 하나의 VLAN만 지원함 
- 2. **트렁크 포트 (Trunk Port)**
	- 여러 VLAN의 트래픽을 전송하는 포트
	- 주로 스위치 간 연결이나 스위치와 라우터 간 연결에 사용됨
	- 트렁크 포트는 802.1Q 태깅 방식을 통해 VLAN 정보를 포함한 데이터를 전송함
- 3. **VLAN ID**
	- VLAN을 식별하는 번호로, 1-4094까지 사용 가능함 (일반적으로 1~1005는 표준 VLAN, 1006~4094는 확장 VLAN).
	- VLAN 1은 기본 VLAN으로, 태그가 없는 데이터는 VLAN 1로 처리됩니다.
### 예시 
아래 그림을 예로 들자면 다음과 같음 
1. **스위치 포트 구성** 
    - 포트 1~10: Access 포트, VLAN 10에 연결.
    - 포트 11~20: Access 포트, VLAN 20에 연결.
    - 포트 21~30: Access 포트, VLAN 30에 연결.
    - 포트 31~40: Access 포트, VLAN 40에 연결.
    - 포트 41: Trunk 포트, VLAN 태그를 사용하여 라우터와 연결.

![](Screenshot%202025-01-19%20at%209.31.48%20PM.png)