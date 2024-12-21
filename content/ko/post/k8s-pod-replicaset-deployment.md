+++
date = '2024-12-21T10:57:31+09:00'
draft = false
title = '[Kubernetes] Pod, ReplicaSet, and Deployment'
tags = ["kubernetes","devops"]
categories = ["devops"]
+++

k8s도 도커같은 컨테이너 엔진을 사용해서 어플리케이션들을 띄움.  
근데 단순하게 워커 노드에 냅다 바로 띄우는게 아니라 Pod 라는 단위에 감싸서 띄움. 

### Pod 란? 

- 클러스터에 띄워져있는 하나 혹은 그 이상의 컨테이너들의 집합 
- k8s에서 가장 작은 단위의 컨트롤 가능한 단위 
- 하나의 Pod에 컨테이너 여러개 띄울수 있긴한데 보통은 안그럼. 어플리케이션 하나가 보통 하나의 Pod로 뜬다고 생각하면 됨. 
  - 여러개 띄우는 경우가 있긴한데, 이런경우는 같은 어플리케이션이 여러개 뜨는게 아니라 메인서버 하나(컨테이너1), 별도 기능을 담당하는 서버 하나 (컨테이너 2), 요런식으로 묶어서 사용함. 
  - Pod 내부에서는 `localhost` 로 소통 가능

근데 일반 Pod의 경우, [지정된 라이프사이클](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/) 이 있음.  
예를들어 Pod가 한번 죽으면, 또 다시 유저가 띄워야됨. 근데 귀찮자나? 좀 자동으로 띄워도 주고 관리도 해주는거 없나?? 🤓  

있음 그게 바로 Workload 임. 

### Workload

기존 Pod의 지정된 라이프사이클을 넘어서 좀더 쉽게 관리 하기 위해 만들어진 기능? object? 임.  
Replicaset, Deployment, StatefulSet, Job/CronJob 등 이 있는데 여기선 ReplicaSet 이랑 Deployment에대해서만 좀 정리해보겠음. 


#### ReplicaSet
- Pod가 지정된 숫자만큼 항상 유지되도록 해줌
- 3개 라고 했으면, 무슨일이 있어도 3개 유지해줌. (죽으면 새로 만들고, 많으면 하나 죽이고 요러면서)
- Deployment라는 상위 개념이 생겨서, 특정한 경우가 아니면 잘안씀. (거의 쓸일 없다고 보면됨)


`example-replicaset.yaml`
```yaml
apiVersion: apps/v1
kind: ReplicaSet              # denotes ReplicaSet
metadata:
  name: frontend
  labels:
    app: guestbook
    tier: frontend
spec:
  replicas: 3                 # Specifies that the ReplicaSet should maintain 3 running Pods.
  selector:                   # Defines the criteria to identify Pods that this ReplicaSet can manage.
    matchLabels:
      tier: frontend          # The ReplicaSet will only manage Pods that have a label "tier: frontend". 
  template:                   # specifying the data of new Pods it should create to meet the number of replicas criteria.
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: us-docker.pkg.dev/google-samples/containers/gke/gb-frontend:v5
```
위에서 `tier: frontend` 레이블을 보고 어떤 pod를 관리할지 판단함.  
예를들어, 3개의 pod(web server)가 이미 떠있는데, 다른 이미지 기반 pod에 `tier: frontend` 붙여서 띄워버리면 4개로 인식하고 4중 하나 죽여버림.  
그래서 레이블링 할때 조심해야함


#### Deployment
- ReplicaSet의 상위 개념(higher abstraction)
- ReplicaSet처럼 여러 Pod를 관리하는데 사용됨. 그냥 ReplicaSet에 기능 몇개 더 추가된 거라고 생각하면됨. 
- 실제로 Deployment 만들면 ReplicaSet도 같이 생성됨.
- when you describe a desired state in a Deployment, the Deployment Controller will change the actual state to the desired state at a controlled rate.
    - version, states, etc ...

**솔직히 차이점 모르겠음... 설명좀 더 해봐... 🧐**

[StackOverflow](https://stackoverflow.com/questions/69448131/kubernetes-whats-the-difference-between-deployment-and-replica-set) 에 친절하게 설명되어있어서 가져와봄. 근데 번역 해야되네.. 쩝...  

```
ReplicaSet만 사용하면 요런 문제가 있음. 예를들어, ReplicaSet써서 서버 3개를 띄워놨는데, 코드 바껴서 다시 띄워야함. 어케할꺼?  
뭐 기존에 있던거 다 죽이고 새로운거 다 다시 띄우면 되잖아? 근데 그러면 중간에 비는 시간을 어쩔껀데?  

그거는 이제 또 새로운 ReplicaSet에 replica를 1로 설정하고 띄운다음에, 기존에 있는거를 3..2...1...0 요런식으로 차근 차근 줄여나가면 되지않을까 (aka rollingupdate)?? 🤨 

그런걸 일일히 사람이 다 한다고? 그거 하다가 백퍼 사고남 ㅋㅋㅋㅋ  
이 모든 과정을 자동화 해주는게 Deployemt임.  
 
Note: Deployment가 직접 pod를 컨트롤 하는게 아니라, replicaSet을 조정하면서 위에 말한 과정을 대신 해주는거임 
```

Part of `example-deployment.yaml`
```yaml
kind: Deployment
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
```
요렇게 업데이트 방식 수정해 줄 수 있음 😉


Reference  
https://kubernetes.io/docs/home/
https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/