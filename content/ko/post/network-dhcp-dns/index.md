---
categories:
  - network|네트워크
date: 2025-01-23T11:25:28+09:00
draft: false
tags:
  - network
title: "[Network] DHCP, DNS"
---
## DHCP (Dynamic Host Control Protocol)
> **DHCP (Dynamic Host Configuration Protocol)** 는 **동적 호스트 구성 프로토콜**로, 네트워크에 연결된 **장치**(컴퓨터, 스마트폰, 프린터 등)가 **자동으로 IP 주소**와 **기타 네트워크 설정**을 할당받을 수 있도록 하는 프로토콜


컴퓨터 IP 세팅에 가면 보통 두가지 옵션을 볼 수 있음
 1. Obtain an IP address automatically
 2. Manually set IP address 

IP 주소를 할당받아서 무슨 IP를 써야 할지 안다면 옵션 2를 선택해서 셋업하면됨.  
근데 첫번째 옵션을 선택하면 알아서 할당해줘! 라고 하는 거임. 근데 이걸 하려면 **DHCP** 서버가 셋업이되어있어야함. 
> 서버를 따로 셋업해도 되고, 라우터가 DHCP서버 역할을 하는 경우도 많음. 

### 주요기능 
- **IP 주소 자동 할당**
	- 네트워크에 접속하는 장치가 DHCP 서버에 요청을 보내면, 서버는 장치에 사용할 **IP 주소**를 자동으로 할당함 
- **기타 네트워크 정보 제공**
	- DHCP는 IP 주소 외에도 서브넷 마스크, 게이트웨이, DNS 서버 등의 네트워크 정보를 장치에 제공함 
> `ifconfig` 로 보면 다 나와있음 

### 동작방식
1. **DHCP Discover** 네트워크에 연결된 장치가 DHCP 서버를 찾기 위해 **DHCP Discover 메시지**를 브로드캐스트로 전송
2. **DHCP Offer** DHCP 서버는 이 메시지를 받아, **IP 주소와 네트워크 설정**을 포함한 **DHCP Offer 메시지**를 해당 장치에 전송
3. **DHCP Request** 장치가 받은 Offer 메시지 중 하나를 선택하여, 서버에 **DHCP Request 메시지**를 보내 요청을 확인
4. **DHCP Ack** DHCP 서버는 장치가 요청한 IP 주소와 설정 정보를 할당하고, **DHCP Ack 메시지**를 통해 이를 확인

### 이점
- **자동화**: 네트워크 장치가 자동으로 IP 주소를 할당받아, **수동 설정의 필요가 없어짐**.
- **관리 용이성**: 대규모 네트워크에서 IP 주소 관리가 용이해지고, 충돌을 방지할 수 있음. 
- **유연성**: DHCP 서버에서 설정을 변경하면, 네트워크에 연결된 모든 장치에 쉽게 적용할 수 있음 
### 장점
- **간편한 네트워크 관리**: IP 주소를 수동으로 할당할 필요 없이, DHCP 서버가 자동으로 관리
- **IP 주소 충돌 방지**: DHCP 서버는 IP 주소를 중복 배정하지 않도록 관리
- **유연성**: IP 주소를 자동으로 갱신하고, 필요에 따라 다른 주소를 할당
### 단점
- **보안 문제**: DHCP 서버가 공격을 받을 경우, 잘못된 IP 주소나 설정을 장치에 할당할 수 있음
- **IP 주소 갱신**: DHCP는 주기적으로 IP 주소를 갱신하기 때문에, 연결이 끊어질 수 있음 

## DNS (Domain Name System)
>**DNS (Domain Name System)**는 **도메인 이름 시스템**으로, 인터넷에서 사용되는 **도메인 이름**을 **IP 주소**로 변환하는 시스템

wwww.google.com -> 142.241.40.196 로 변환해줌.

### 주요 기능 
- **도메인 이름을 IP 주소로 변환**
	- 인터넷에 접속하려면 각 장치가 IP 주소를 알아야 하는데, DNS는 사용자가 입력한 도메인 이름을 해당하는 IP 주소로 변환함 
- **이메일 라우팅** 
	- 이메일 서버를 찾을 때 사용하는 **MX 레코드**를 통해 이메일을 올바른 서버로 전달할 수 있도록 도와줌
- **네임서버 관리** 
	- DNS는 다양한 **네임서버**를 사용하여 도메인 이름에 대한 정보를 관리하고 제공
### 작동 방식 
1. **사용자가 도메인 이름 입력**  
   사용자가 브라우저에 `example.com`을 입력하면, 브라우저는 이 도메인 이름을 IP 주소로 변환하기 위해 DNS를 사용
2. **로컬 캐시 확인**  
   먼저, 컴퓨터나 디바이스가 이미 이전에 `example.com`의 IP 주소를 캐시(cache)로 저장했는지 확인. 저장되어 있다면 바로 해당 IP 주소를 사용하여 웹사이트에 접속
3. **DNS 리졸버 요청**  
   로컬 캐시에 주소가 없다면, 컴퓨터는 DNS 리졸버(DNS resolver)에 요청을 보냅니다. DNS 리졸버는 보통 인터넷 서비스 제공업체(ISP)에서 제공하며, 도메인 이름에 해당하는 IP 주소를 찾는 역할을 함
4. **루트 DNS 서버**  
   DNS 리졸버가 도메인 이름에 대한 정보를 모를 경우, 먼저 루트 DNS 서버에 요청을 보냄. 루트 서버는 도메인 이름 시스템의 최상위에 위치하며, 어떤 DNS 서버가 해당 도메인의 정보를 가지고 있는지 알려줌 
5. **TLD DNS 서버**  
   루트 DNS 서버는 도메인 이름의 최상위 도메인(TLD, 예: `.com`, `.org`)에 해당하는 DNS 서버를 안내합니다. 예를 들어, `example.com`이라면 `.com` TLD 서버로 요청을 보냄
6. **권한 있는 DNS 서버**  
   TLD 서버는 도메인을 관리하는 권한 있는 DNS 서버(Authoritative DNS Server)로 요청을 전달합니다. 이 서버는 실제로 `example.com`의 IP 주소를 알고 있는 서버임.
7. **IP 주소 반환**  
   권한 있는 DNS 서버는 `example.com`에 해당하는 IP 주소를 반환
8. **브라우저 연결**  
   DNS 리졸버는 이 IP 주소를 사용자에게 전달하고, 브라우저는 이 주소를 사용하여 해당 웹사이트의 서버에 연결
9. **캐시 저장**  
   IP 주소를 받은 후, 브라우저와 DNS 리졸버는 이를 일정 시간 동안 캐시로 저장하여 이후에 같은 요청이 있을 경우 더 빠르게 처리할 수 있게 함


### DNS의 이점
- **편리성** 사람이 이해하기 쉬운 도메인 이름을 사용하여 웹사이트에 접속할 수 있게 함.
- **유연성**  도메인 이름을 IP 주소에 맞게 관리할 수 있어, 서버의 IP 주소 변경 시에도 도메인 이름을 그대로 사용할 수 있음
- **분산 시스템**  DNS는 분산형 시스템으로, 여러 서버가 협력하여 서비스를 제공합니다. 이를 통해 **빠른 응답**과 **안정성**을 보장함 

### DNS의 단점
- **보안 취약점**  DNS는 공격의 대상이 될 수 있. 예를 들어, **DNS 스푸핑**(DNS 캐시 중독) 공격을 통해 잘못된 IP 주소로 사용자를 유도할 수 있음 
- **중앙화된 시스템 의존성** 일부 중요한 DNS 서버가 다운되면, 많은 사용자들이 인터넷에 접속할 수 없게 됨 


## 실생활 예시  

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

## Domain Names 구조 
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
