---
categories:
  - DevOps
date: 2025-01-24T15:09:28+09:00
draft: false
tags:
  - docker
title: "[Docker] Storage, Storage Driver"
---
## Docker File System
도커를 설치하게 되면, 로컬환경에 다음과 같은 폴더가 생성됨. 그리고 해당 폴더에 각각 컨테이너, 이미지, 볼륨등을 저장함. 

- `/var/lib/docker`
	- `aufs`
	- `containers`
	- `image`
	- `volumes` 

> MacOS 랑 윈도우는 Docker Desktop을 사용하기 때문에 docker 관련 데이터가 LinuxKit VM내부에 저장됨. 그래서 위 폴더가 존재하지 않음. 

## Docker Volumes 
도커의 컨테이너의 경우 파일을 수정하거나 생성해도 컨테이너가 사라지면 해당 데이터도 같이 사라짐. 만약 컨테이너가 없어져도 해당 데이터를 남기고 싶다면?!  `Volume`을 사용하면 됨.
### Volume Mounts
아래 커맨드를 실행하면 아래처럼 볼륨이 생성됨. 
```bash 
docker volume create data_volume 

# var/lib/docker
# ├── volumes
# |   ├── data_volume
```

이후 컨테이너 실행시 해당 볼륨을 마운트 할 수 있음 
```bash
docker run -v data_volume:/var/lib/mysql mysql 
# docker run -v {volue_name}:{location_in_container} {image_name}
```
이후 컨테이너가 사라져도 해당 데이터는 `data_volume`에 그대로 남아있음. 

> 추가로 볼륨을 생성하지 않고 컨테이너 생성할때 냅다 마운트 해버리면 도커에서 잘 알아서 볼륨 생성해줌 :) 

요 방식이 Volume Mounts 라고 불림 

### Bind Mounts 
흠 /var/lib/docker에 저장하기 싫으면? 🤔

그럴때는 그냥 볼륨 이름 대신 원하는 위치를 넣어주면 됨. 
```bash
docker run -v /data/loc:/var/lib/mysql mysql 
# docker run -v {volume_path}:{location_in_container} {image_name}
```

요방식은 Bind Mounts라고 불림. 

### tmpfs mounts 
요 방식은 로컬 디스크에도 저장안하고 심지어 컨테이너에도 저장을 안함... 그냥 호스트의 메모리에 데이터를 저장함.   

그래서 컨테이너가 멈추거나 호스트 기기가 껏다 켜지면 데이터도 함께 사라짐.  
엥? 그럼 이걸 왜씀??   

보통 temporary / in-memory storage 에 사용되는데, 보통 캐시나 credential같은 정보를 저장하기 위해 사용됨 :) 


## COW (Copy On Write)
이미지랑 컨테이너는 알겠는데 저 aufs는 머임???   흠... 이건 좀 설명이 길어짐.  

먼저 도커는 데이터를 레이어(읽기전용 이미지 와 쓰기가 가능한 컨테이너 데이터)로 나누어 관리함. 이걸 Layared Architecture 라고함. 

### 작동 원리 
1. 이미지 생성 
	-  이미지는 아래 그림 처럼 여러 레이어로 쌓임. (Read Only)

2. 컨테이너 생성 
	- 컨테이너를 실행하면, Docker는 이미지의 읽기 전용 레이어 위에 쓰기 가능한 레이어를 추가함 (Read Write)
	- 이 쓰기 레이어는 컨테이너 내에서의 모든 변경 사항을 저장함
		- 로그 메시지, 생성된 데이터등 
![](Screenshot%202025-01-24%20at%204.18.17%20PM.png)
3. **파일 시스템 관리**
	- 컨테이너 내부에서 파일을 읽을 때
	    - 데이터는 이미지 레이어에서 읽힙니다.
	- 컨테이너 내부에서 파일을 수정할 때:
	    - **Copy-on-Write(CoW)** 기술이 적용되어 파일이 쓰기 가능한 레이어로 복사되고, 수정된 내용은 복사된 파일에 저장됨. 
		- 예를 들어, 이미지에 app.py가 포함되어 있는데 해당 파일을 수정하게 되면 이미지가 수정되는게 아니라 해당 파일이 Container Layer로 복사되고 이후에 수정됨. 

> Copy-on-Write 이 있기 때문에 이 Layared 구조가 가능한거임!

그럼 이걸 도커가 다하냐? ㄴㄴ 이걸하는게 Storage Driver 임.

## Storage Driver 

- 이미지를 여러 읽기 전용 레이어로 분리
- 컨테이너 생성시, 새로운 쓰기 가능 Layer생성 
- Copy-on-Write 구현 
- 컨테이너 간 데이터 공유 
	여러 컨테이너가 같은 이미지를 기반으로 동작할때, 이미지 레이어를 공유 하며 디스크 사용량을 최소화함. 

이와 같이 도커가 효율적으로 디스크를 사용할 수 있게 해주는게 Storage Driver임. 

그리고 여러 종류가 있음.  (OS별로 다른거 사용함)
- aufs
- zfs
- btrfs
- Device Mapper
- overlay
- overlay2








