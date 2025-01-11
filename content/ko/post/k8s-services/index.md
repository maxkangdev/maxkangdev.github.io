+++
date = '2024-12-28T10:13:46+09:00'
draft = false
title = '[Kubernetes] Services'
tags = ["kubernetes"]
categories = ["devops"]
+++


## k8s 네트워크 기본지식

뭐든간 네트워크가 제일 헷갈림. 아래 순서대로 정리해보았음.

- 단일 노드 클러스터 네트워크  
- 다중 노드 클러스터 네트워크  
- k8s 서비스

### 단일 노드 클러스터 네트워크

{{< figure src="k8s-service-single-node.png" alt="alt" width="600" height="300" >}}

- 해당 노드 접속시(ssh등) 에 사용되는 IP 주소 (ex. 192.168.1.2)가 있음.

**POD IP 주소**  
- k8s 에서 IP 주소의 경우 container가 아니라 pod 에게 할당됨. 
- 각 pod는 (클러스터 내부에서 사용되는) IP 주소를 받음 (Ex. 10.244.0.2)

**Kubernetes 내부 네트워크**  
- k8s는 pod 간 통신을 위해 내부 private 네트워크를 생성함 (Ex. 10.244.0.0)
- 그리고 해당 네트워크에서 각 pod는 IP 주소를 할당받음 (Ex. 10.244.0.2, 10.244.0.3)

**POD 간 통신**  
- 그렇게 할당받은 IP 주소를 사용해서 pod끼리 통신함

근데 이렇게 내부 IP 쓰면 안좋음. **왜, 와이?**
- pod가 애초에 자주 죽고 새로 생기고를 반복하는데, 그럴때마다 IP 주소가 새로 할당됨.
- 만약 IP를 env로 쓰고 있었으면, pod 죽었다 살아나면 IP를 다시 설정해줘야되는거임....😵‍💫


### 다중 노드 클러스터 

{{< figure src="k8s-service-multi-node.png" alt="alt" width="600" height="300" >}}

- 단일 노드와 동일하게, 각 노드는 IP 주소를 가지고 있음 (e.g., 192.168.1.2 and 192.168.1.3)
- 단일 노드와 동일하게, 각 노드는 내부 네트워크가 있음. 하지만, 내부 네트워크 IP range 가 똑같음 (Ex. 둘다 10.244.0.0)
- 이러면 백퍼 문제생김

**IP 충돌문제**  
노드 내부 IP 주소 범위가 똑같기 때문에, 다른 클러스터에 있는 pod랑 통신하면 문제생김. 

**k8s 네트워크 Requirements**
- k8s에서 이거 해결안해줘서 알아서 해결해야댐. 
- 그리고 다음 네트워크 조건도 충족해야 됌. 
  - NAT 없이 pod to pod 간 통신이 가능해야함 
  - NAT 없이 node to pod 통신이 가능해야함 

**Pre-built Networking Solutions**
하지만 다행이 사용가능한 솔루션들이 많음. 아래중 하나 골라서 그냥 쓰면 해결됌. ㅎㅎ 
- Cisco ACI networks 
- Cilium 
- Big Cloud Fabric 
- Flannel 
- VMware NSX-T 
- Calico

위에 솔루션중 하나 사용하면, 노드 내부 IP 주소마다 유니크한 IP를 부여해줌.  
이러면 pod간 통신할때 IP 충돌에대한 걱정 안해도됌. 

## 서비스(Service)

**서비스**는 여러 종류가 있는데, k8s 내부 및 외부 통신을 좀더 원활하게 할 수 있도록 도와줌

#### 이게 왜필요함? 걍 기본으로 딸려오는 IP 주소 쓰면안댐?
아래와 같은 문제점들 때문에 안댐 😏 

1. **Pod가 많아지고 application의 종류가 많아지면 관리안댐**
   - Front-end web servers, Backend servers , Redis key-value store, MySQL persistent database ...
   - 요놈들 IP 주소 다 관리할 자신있음? 난 없음
2. **Challenge of IP Addressing**
   - 위에서 이미 말했다 시피, 기본으로 딸려오는 IP는 pod가 죽었다 깨면 새로 할당됨
   - 그렇기 때문에 제대로된 통신을 위해서 해당 IP 주소에 의존할 수 없음.

**Kubernetes 해결책 -> `Service`**
  - 서비스를 통해 Pod 혹은 여러개의 Pod를 하나로 묶고 해당 묶음과 통신할수 있는 인터페이스를 제공함 
    - `Ex` 다수의 pod로 이루어진 Backend용 서비스, 다수의 pod로 이루어진 web Server용 서비스, 여러개의 Pod가 있는 redis 서비스 등...
  - 또한 이러한 방식통해 Microservice 아키텍쳐를 쉽게 구출할 수 있게됨 
    - 특별한 설정이나 변경없이 pod 갯수를 늘리거나 줄여도 Service 라는 인터페이스의 존재덕분에 문제가 발생하지 않음

**서비스**는 여러 종류가 있는데, 대표적으로 아래 3개가 제일 많이 사용됨 
- NodePort
- ClusterIP
- LoadBalancer

### NodePort
- 외부(k8s 밖)에서 pod를 접근할 수 있도록 하게함
- 노드의 port와 pod의 port를 연결해줌 
- 예를들어, 내부 pod 8080 에서 실행되는 웹앱을 노드에 있는 port를 통해 접근할수 있음. 
- node의 포트를 아래 범위에서만 사용가능함
  - 300000 - 32767

{{< figure src="k8s-nodeport.png" alt="alt" width="400" height="200" >}}

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-service

spec:
  type: NodePort
  ports:
    - targetPort: 80      # Optional, 없으면 port랑 똑같은 값 사용
      port: 80            # required
      nodePort: 30008     # Optional 없으면 남은거중에 아무거나 알아서 할당함
  selector:             # 위 포트와 어느 Pod를 연결할지 정하는데 사용함 
    app: myapp
    type: front-end  
```

**같은 label을 가진 pod가 여러개일 경우**
- 해당 Pod를 전부 port와 연결함 
- 그럼 누구한테 request forward 할지 어케정함?
  - random 알고리즘 사용해서 아무한테나 forward함. 어느정도 load balancer 역할도 한다고 볼 수 있음.

**다중 노드에 pod가 여러개일 경우**
- 따로 뭐 할거 없음. k8s 서비스가 다 알아서 처리해줌. 
- 여러개의 노드중 아무 IP사용해도 다 접속 가능함. 

{{< figure src="k8s-nodeport-2.png" alt="alt" width="600" height="300" >}}


### ClusterIP
- 내부에서 pod를 접근할수 있게 해줌
- 클러스터 내부에서만 액세스가 가능함 
- type에 아무것도 안적으면 자동으로 ClusterIP로 설정됨

```yaml
apiVersion: v1
kind: Service
metadata:
  name: back-end
spec:
  type: ClusterIP # default
  ports:
    - targetPort: 80
      port: 80
  selector:
    app: myapp
    type: back-end

```

### LoadBalancer
- 외부 로드 밸런서를 사용하여 서비스를 외부에 노출시킴
- 쿠버네티스는 로드 밸런싱 구성 요소를 직접 제공하지 않음. 
- 직접 제공하거나 클라우드 제공자와 함께 사용해야함. 아래 그림처럼 Loadbalancer는 NodePort와 다르게 k8s 외부 환경에 위치하기 때문임. 
- 만약 환경이 지원하지 않는 경우 kind를 LoadBalancer로 지정하면, 단순히 NodePort로 변환됨

{{< figure src="k8s-loadbalancer.png" alt="alt" width="600" height="300" >}}


#### 그럼 실질적으로 NodePort 랑 Load Balancer 차이가 뭐임... 아직 좀 헷갈리는디? 😓
| **NodePort**                                                                   | **Load Balancer**                                                                       |
|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|
| `NodePort` 서비스를 생성함으로서, 모든 노드의 포트로 오는 트래픽을 pod에 연결된 서비스로 포워딩함                  | `Load balancer`에서 이런 포트 지정은 없음                                                          |
| `NodePort` 서비스는 서비스의 내부 `Cluster IP`뿐만 아니라 모든 노드의 IP와 지정된 노드 포트를 통해서도 접근할 수 있음 | `Load balancer`의 공용 IP를 통해서만 접근 가능함                                                     |
| 포트를 명시적으로 지정할 필요는 없음. 생략하면 쿠버네티스가 임의의 포트를 선택함 (기본 범위는 30000 - 32767)           | `Load balancer`는 고유한 공용 IP 주소를 가지며, 모든 연결을 해당 서비스로 리다이렉트함                               |
| 만약 클라이언트가 첫 번째 노드에만 연결한 상태면, 그 노드가 실패할 경우 클라이언트는 더 이상 서비스에 접근할 수 없음            | `Load balancer`는 노드 앞에서 요청을 모든 정상적인 노드로 분산시키며, 그 순간 오프라인인 노드로는 요청을 보내지 않기 때문에 문제가 되지않음. |


Reference  
https://kubernetes.io/docs/home/  
https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/  
https://stackoverflow.com/questions/34443138/difference-between-nodeport-and-loadbalancer


