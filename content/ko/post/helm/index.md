---
categories:
  - DevOps
date: 2025-01-30T14:44:49+09:00
draft: false
tags:
  - Helm
title: Helm 이란?
---
## 개요 
Kubernetes는 컨테이너화된 애플리케이션을 쉽게 배포 / 관리 / 확장 할 수 있게 해줌으로서 현대 DevOps의 필수적인 기술중 하나로 자리잡았습니다.   

가볍게 써보면 정말 편리하고 다양한 기능을 제공해주지만 workload, service, pv(c) 등 Kubernetes의 리소스 의 갯수가 점점 늘어날수록  관리가 어려워집니다.  

단순하게 WordPress 웹사이트 하나를 Kubernetes환경에 띄우려해도 설정해야할 부분이 정말 많아지죠. 
- Deployment
- Service
- PV
- PVC
- Secret 
등... 

이렇게 되면 아래처럼, 각 Kubernetes 리소스마다 yaml 또한 관리해주어야합니다. 또한 별도로 `kubectl apply -f` 를 통해 별도로 또 띄워줘야하죠 😓
![](Screenshot%202025-01-30%20at%202.58.15%20PM.png)

>귀찮으면 걍 하나의 yaml로 관리하면 되잖아? 🧐

물론 그렇게 해도 되지만, WordPress관련 특정 값을 변경하거나 TroubleShooting 과정에서 몇백줄가량 되는 yaml 파일을 전부 뒤지고 있는 것도 쉬운 일이 아닙니다ㅠ  

그래서 나온게 바로 **Helm** 입니다 😇

## Helm 이란?
> The package manager for Kubernetes  
그게 뭔데...? 😅 

쉽게 설명하자면, Kubernetes에서는 개별적으로 처리했었던 리소스들 (Deployment, Service, PV, Etc...)을 하나의 패키지로 묶어서 관리할 수 있게해주는 솔루션 입니다.  

만약 기존에는 아래와 같은 커맨드를 통해 Kubernetes 리소스 하나하나 일일히 설치 해주어야 했었다면 
```zsh
kubectl apply -f service.yaml
kubectl apply -f pv.yaml
kubectl apply -f deployment.yaml
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml
...
```

Helm을 사용하게 되면 아래 커맨드 하나로 한번에 설치 가능하게 됩니다 :)  물론 업데이트, 삭제, 롤백 과 같은 기능도 제공해줍니다. 

```zsh 
helm install [release-name][chart-name]
# helm install my-site bitnami/wordpress
```
> **release-name은 왜필요한거임 걍 chart-name만 쓰면 안댐?** `helm install bitnami/wordpress`  
> 아래처럼 같은 차트로 여러 release 만들 수도 있잖슴.   
> `helm install my-test-site bitnami/wordpress`  
> `helm install my-real-site bitnami/wordpress`   

## 구성

![](Screenshot%202025-02-02%20at%2010.57.09%20PM.png)
- `helm cli`   
	- Chart 설치 / 업그레이드 / 롤백과 같은 Helm 기능을 사용하기 위한 Command Line Tool   
- `Chart`   
	- Kubernetes 리소스들을 생성하기 위해 필요한 정보들을 담고 있는 파일 
- `Release`
	- Chart가 적용되었을때 Kubernetes Cluster안에 생성되는 어플리케이션 
- `Revision`
	- Release의 스냅샷으로 어플리케이션(=Release)에 변경사항이 생길 경우 생성됨.  
- `Secret`(=`Metadata`)
	- Release 관련 정보들(변경사항등)로 Kubernetes Secret형태로 저장됨. 
- `Online Chart Repository`
	- helm 차트들 repository. 대표적으로 https://artifacthub.io/ 가 있음 


## Helm Chart File Structure 
Helm 차트에 대해서 더 자세히 알아봅시다.   
각 차트는 하나의 디렉터리로 구성되며, 해당 디렉터리 안에 여러 필수 및 선택적 파일들이 포함됩니다.

>Helm 차트는 다음과 같은 파일과 디렉터리로 구성됩니다:
```zsh
<차트 이름>/
  Chart.yaml          # 차트의 메타데이터 (필수)
  values.yaml         # 기본 설정 값 (필수)
  values.schema.json  # values.yaml의 구조를 검증하는 JSON 스키마 (선택 사항)
  charts/             # 이 차트가 의존하는 다른 차트들 (선택 사항)
  crds/               # Custom Resource Definition (CRD) 파일 (선택 사항)
  templates/          # Kubernetes 매니페스트 템플릿 (필수)
  templates/NOTES.txt # 사용 안내 (선택 사항)
  LICENSE             # 차트의 라이선스 정보 (선택 사항)
  README.md           # 차트 설명 및 사용 방법 (선택 사항)
```
### 📁 주요 파일 설명
 **Chart.yaml (필수)**  
차트의 이름, 버전, 설명 등을 포함하는 메타데이터 파일입니다.
```yaml
apiVersion: v2
name: my-app
description: A Helm chart for Kubernetes
version: 1.0.0
appVersion: "1.16.0"
```
**values.yaml (필수)**  
차트의 기본 설정 값을 정의하는 파일입니다. 사용자는 이 파일을 수정하거나 `--set` 옵션을 통해 값을 변경할 수 있습니다.
```yaml
replicaCount: 3
image:
  repository: my-app
  tag: latest
service:
  type: ClusterIP
  port: 80
```

### 📁 주요 디렉터리 설명

 📌 charts/  
이 차트가 의존하는 다른 서브 차트를 저장하는 디렉터리입니다. `helm dependency update`를 실행하면 필요한 차트가 여기에 저장됩니다.

 📌 crds/  
Kubernetes의 Custom Resource Definition(CRD) 파일을 포함하는 디렉터리입니다. CRD는 Kubernetes에 새로운 리소스 타입을 추가할 때 사용됩니다.
 
 📌 templates/  
Kubernetes 리소스를 생성하는 템플릿 파일이 들어 있는 디렉터리입니다. Helm은 이 템플릿을 `values.yaml`과 결합하여 최종 매니페스트 파일을 생성합니다.

📌 templates/NOTES.txt (선택 사항)
차트 설치 후 사용자에게 표시할 안내 메시지를 작성하는 파일입니다.

### 🛠️ 정리
- Helm 차트는 특정 디렉터리 구조를 따르며, `Chart.yaml`, `values.yaml`, `templates/`는 필수 요소입니다.
- `values.yaml`을 통해 기본 설정을 정의하고, `templates/`에서 Kubernetes 매니페스트를 동적으로 생성합니다.
- `charts/`, `crds/`, `values.schema.json` 등은 선택 사항이며, 필요에 따라 추가됩니다.

이 구조를 이해하면 Helm을 사용하여 Kubernetes 애플리케이션을 쉽게 패키징하고 배포할 수 있습니다. 🚀
>더 자세한 내용은 https://helm.sh/docs/topics/charts/ 를 참조하세요. 



## References  
- [Helm Charts Documentation](https://helm.sh/docs/topics/charts/)  
- [Certified Kubernetes Administrator Course (Udemy)](https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/)
