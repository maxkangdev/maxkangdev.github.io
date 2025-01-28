---
categories:
  - DevOps
date: 2025-01-27T15:12:04+09:00
draft: false
tags:
  - kubernetes
title: "[Kubernetes] Ingress"
---
본 글을 읽기전 [Kubernetes Service](k8s-services) 에 대해 알고 계시면 이해해 도움이 됩니다 :) 

## Ingress는 왜필요한가? 
> 예시를 통해 설명해보겠슴다.  온라인 쇼핑몰 웹사이트를 쿠버네티스를 통해 호스팅 하고 있다고 가정해봅시다.   
> 	그리고 해당 웹사이트는 서비스 Pod 3개와 Mysql DB Pod 하나로 이루어져 있습니다. 

### 문제 1 
> 해당 서비스를 클러스터 외부에서 접속하려면? 

**NodePort** 뚫으면됨 ㅋ  
그러면 `http://{node-ip}:{node-port}` 로 해당 서비스에 접속이 가능함 :)   
그리고 NodePort가 알아서 Pod 사이에 트래픽도 처리해줌. 

### 문제 2
> 아 근데 node-ip 로 들어가는건 좀 짜치자나... my-online-store.com 이렇게 해서 들어갈 순 없음? 

DNS 서버에서 node-ip <-> my-online-store 매핑되도록 설정하면 됨 ㅋ 
그러면 `http://my-online-store:{node-port}` 로 해당 서비스 이제 접속 가능함. ㅇㅋ? 

### 문제 3 
> 근데 node-port 쓰는것도 좀 짜치자나.... 그냥 my-online-store.com 으로 들어가고 싶다고.... 😓

아 ㅇㅋㅇㅋ   
그럴땐 DNS 서버랑 K8s Cluster 사이에 Proxy 서버를 하나 둬야댐.  
그래서 Proxy 서버 포트 80번으로 들어오는 요청들을 다 `http://{node-ip}:{node-port}` 요쪽으로 보내버리도록 설정하는 거지.   
그러면 이제 `http://my-online-store` 로 접속 가능함.   
> **FYI**   
> URL에 포트 지정안되어있으면 default값으로 아래가 사용됨.   
> For `http://`: Port **80** is the default.  
> For `https://`: Port **443** is the default.

추가로 GCP 나 아마존같은 클라우드 솔루션에서 저 Proxy 서버 기능을 제공해주는데 이거 이름이 Load Balancer 임. 
![](Screenshot%202025-01-27%20at%203.58.13%20PM.png)


이제 됐지? 

### 문제 4 
> 흠 그렇긴한데... 만약 내 웹사이트가 커져서 다른 서비스들도 제공하기 시작하면 어캄? 

그럼 뭐 아래처럼 별도로 LoadBalancer(Proxy 서버) 하나더 따야지 별수 있나. 
![](Screenshot%202025-01-27%20at%204.17.39%20PM.png)

### 문제 5 
> 둘이 IP 다르자나... 나는 똑같이 IP 쓰고싶은데?   
> 예를들어. http://my-online-store.com/watch 로 새로운 스트리밍 서비스를 제공하는거지.  

아 그것도 근데 결국 아래처럼 별도로 LoadBalancer(Proxy 서버) 하나더 따야됨 ㅋㅋㅋ 
![](Screenshot%202025-01-27%20at%204.19.10%20PM.png)

### 문제 6
> 뭐 해결이 되긴하네.. 근데 시스템 규모가 좀 커지면 관리하기가 힘들어질것 같은데?   
>  새로운 서비스가 생길때마다 Load Balacner / Proxy 서버가 필요하자나? 돈 많이 들것 같은데...  
>   Load Balancer를 클라우드에서 제공해주는거면 다른 클라우드로 옮길때는 더 Load Balancer는 또 다시 다 설정해줘야되는거아니야? 의존성이 너무 큰데... 

걍 Ingress 써라 그냥...

## Ingress란 
>an API object that shows how traffic from the internet should reach internal Kubernetes cluster Services that send requests to groups of Pods.

간단히 말해서, 쿠버네티스에서 제공하는 L7 Load Balancer임.  
쿠버네티스에서 제공하는 리소스기 때문에 클라우드 의존성이 없고 쉽게 설정이 가능함.  

다만 쿠버네티스 리소스기 때문에 노드포트나 Proxy 서버/Load Balancer를 통해 외부와 연결은 해줘야함.  
대신 그렇게 연결 한번만 해주면 이제 내부에서 라우팅, SSL 설정 등 별에별 기능이 쉽게 추가 될 수 있음.  
![](Screenshot%202025-01-27%20at%204.39.05%20PM.png)

### Ingress 구성 
Ingress 가 제대로 동작하기 위해서 다음과 같은 컴포넌트들이 필요함. 
- Ingress 컨트롤러 
- Ingress 리소스 

### Ingress Controller 
`Ingress`는 단독으로 동작하지 않으며, 이를 실제로 구현하는 **Ingress Controller**가 필요합니다.   

Ingress Controller는 클러스터 내에 배포되는 컴포넌트로, `Ingress` 리소스를 감시하고 규칙에 따라 트래픽을 라우팅합니다.

다양한 종류의 Ingress Controller들이 존재하며, 대표적으로 [nginx](https://github.com/kubernetes/ingress-nginx/blob/main/README.md#readme) 가 있습니다. 
>아래 페이지의 가이드를 통해 ingress Controller(ngix)의 yaml 파일 및 클러스터에 띄우는 방법을 볼 수 있습니다. 
> https://kubernetes.github.io/ingress-nginx/deploy/

추가 예
- Traefik
- HAProxy
- Contour 등 ... 

### Ingress Resource
> A set of rules and configurations applied to ingress controller로 라우팅 규칙과 설정을 정의하는 kubernetes 리소스.   
> 대부분 Ingress를 말하면 Ingress Resource를 말하는 경우가 대다수 임 ㅎㅎ


### 예시 1 
다음 rule들을 포함한 ingress 리소스 예시. 
- Ingress Controller 기본주소가 `http://<IP>` 라는 가정하에 
- `http://<IP>/test`1 path로 들어오는 트래픽을 test1:80 으로 전달해라
- `http://<IP>/test2` path로 들어오는 트래픽은 test2:80 으로 전달해라 
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx-example
  rules:
  - http:
      paths:
      - path: /testpath1
        pathType: Prefix
        backend:
          service:
            name: test1
            port:
              number: 80
      - path: /testpath2
        pathType: Prefix
        backend:
          service:
            name: test2
            port:
              number: 80
```

### 예시2 
다음 rule들을 포함한 ingress 리소스 예시. 
-  `foo.bar.com/bar`  -> service1:80 
- `*.foo.com/foo` -> service2:80 
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-wildcard-host
spec:
  rules:
  - host: "bar.foo.com"
    http:
      paths:
      - pathType: Prefix
        path: "/bar"
        backend:
          service:
            name: service1
            port:
              number: 80
  - host: "*.foo.com"
    http:
      paths:
      - pathType: Prefix
        path: "/foo"
        backend:
          service:
            name: service2
            port:
              number: 80
```

### Ingress 확인하기 
```bash
kubectl describe ingress minimal-ingress
```
---

**Reference**   
- [Traefik Glossary: Kubernetes Ingress and Ingress Controller](https://traefik.io/glossary/kubernetes-ingress-and-ingress-controller-101/)
- [Udemy: Certified Kubernetes Administrator Course](https://samsungu.udemy.com/course/certified-kubernetes-administrator-with-practice-tests)


