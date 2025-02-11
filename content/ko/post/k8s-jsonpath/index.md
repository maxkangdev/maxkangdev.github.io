---
categories:
  - DevOps
date: 2025-02-11T20:29:57+09:00
draft: false
tags:
  - kubernetes
title: "[Kubernetes] Kubect에 Json Path 사용하기"
---
**만약 Json Path 가 뭔지 모른다면 [이 글](jsonpath) 을 먼저 살펴보세요 :)** 

## Kubernetes에서의 JsonPath 
kubectl의 경우 아래와 같은 방식으로 동작함. 
1. kubectl -> kube-apiserver로 요청을 보냄 
2. kube-apiserver는 Json 형태로 답장을 함 
3. Kubectl은 Json형태의 답장을 사용자가 보기 편하게 Parse 하여 terminal 에 보여줌. 

kube-apiserver가 반환한 답변에는 많은 양의 정보가 들어있지만, kubectl은 사용자가 보기 편하게 필요한 정보만 걸러내서 보여줌.  
몇몇 커맨드는 `-o wide`를 붙여서 정보를 더 볼수 있긴하지만 아직도 정보가 다 나타나지는 않음. 

> 더 자세한 정보를 보고싶다면? 아니면 내가 원하는 정보만 커스텀하게 뽑아서 보고싶다면? 

**Json Path**를 사용하면됨.  
Json Path를 사용하면 kube-apiserver가 반환한 json 답장에서 내가 원하는 정보를 뽑아낼 수 있음.  

JsonPath의 주요 사용사례중 하나인 **API 응답 데이터에서 특정 필드 추출** 이라고 생각하면됨. 

## 사용방법 
1. 원하는 kubectl 커맨드 지정 
```zsh
kubectl get pods 
```
2. 해당 커맨드의 json output 형태 확인 
```zsh
kubectl get pods -o json
```
3. Json Path Query  작성
```zsh
.item[0].spec.containers[0].image 
```
> $ 는 안써도됨
1. kubectl 와 함께 Json Path Query 사용 
```zsh
kubectl get pods -o=jsonpath='{.item[0].spec.containers[0].image}' 
```
> Json Path Query 를 '{ }' 감싸주어야함 

## 예제 및 추가 사용법

클러스터내부 노드 이름 
```zsh
kubectl get nodes -o=jsonpath='{.items[*].metadata.name}'
```

노드별 하드웨어 아키텍쳐 
```zsh
kubectl get nodes -o=jsonpath='{.items[*].status.nodeInfo.architecture}'
```

노드별 cpu count 
```zsh
kubectl get nodes -o=jsonpath='{.items[*].status.capacity.cpu}'
```

위 세게 합쳐서 한방에 날리기
```zsh
kubectl get nodes -o=jsonpath='{.items[*].metadata.name}{.items[*].status.capacity.cpu}'
```

근데 저렇게 날리면 안이쁘게 나옴. 요렇게 사이에 `{"\n"}` 추가 해주면 새로운 라인에 찍힘. `{"\t}` <-요건 tab 
```zsh
kubectl get nodes -o=jsonpath='{.items[*].metadata.name}{"\n"}{.items[*].status.capacity.cpu}'
```

아래와 같이 내부에 single quote`'` 을 사용할 경우 double quote`"` 으로 Json Path를 감싸주어야함  
```zsh
kubectl config view --kubeconfig=/root/my-kube-config -o=jsonpath="{.contexts[?(@.context.user=='aws-user')]}"
```
### Loop 사용 
근데 위처럼 쓰면 아래 처럼 나옴. 
```zsh
master node01 
4	   4
```

하지만 우리는  B처럼 나오게 하고싶음.
```zsh 
master 4
node01 4
```

> 이럴 땐 아래 처럼 loop을 써야댐. 
```zsh
kubectl get nodes -o=jsonpath='{range .items[*]}{metadata.name}{"\t"}{.status.capacity.cpu}{"\n"}{end}'
```

### Custom Columns 
위와 동일한 결과를 `custom-columns`  를 사용하여 실행 할 수 있음. 
```zsh
#kubectl get nodes -o=custom-columns=<COLUMNE NAME>:<JSON PATH>
kubectl get nodes -o=custom-columns=NODE:.metadata.name,CPU:.status.capacity.cpu
```
> There should be no space when setting multiple columns 
### Sort
Json Path로 결과를 sorting 할 수 도 있음 
```zsh
kubectl get nodes --sort-by=.metadata.name         # sort node by name
kubectl get nodes --sort-by=.status.capacity.cpu   # sort node by cpu
```


## Reference
- [Udemy: Certified Kubernetes Administrator Course](https://samsungu.udemy.com/course/certified-kubernetes-administrator-with-practice-tests)