+++
date = '2024-12-18T15:14:49+09:00'
draft = false
title = '[Kubernetes] Cluster Architecture'
tags = ["kubernetes","devops"]
categories = ["devops"]
+++

- **k8s 클러스터**
  - 컨테이너화된 애플리케이션을 실행하는 머신(노드)의 집합

> ![](/image/kubernetes-cluster-components.png)

- **Control Plane**
  - k8s 클러스터의 전반적인 상태 및 작업을 관리하는 중심 구성 요소로 다음과 같은 작업을 수행함 
    - 워크로드 스케줄링
    - 애플리케이션의 원하는 상태 유지
    - 기타 ...
    - 클러스터 내의 어떤 머신에서도 실행될 수 있음 (근데 보통 마스터 노드에서 실행됨)

- **노드 (Node)**
  - 애플리케이션 워크로드를 실행하는 단일 머신 (물리적 또는 가상) 
  - 걍 단순하게 컴퓨터 한대라고 생각하삼  
  - 각 노드는 k8s가 POD를 스케줄링하고 관리하는 단위임  
    - 노드는 두가지 종류가 있음 
      - **마스터 노드 (Master Node)**
        - **Control Plane**을 실행
        - 보통 Control Plane 요소만 실행하지만, 실제 컨테이너화된 애플리케이션을 실행하는 것도 가능 (설정에 따라 다름).
      - **작업자 노드 (Worker Node)**
        - 실제 애플리케이션을 실행합니다. 컨테이너화된 애플리케이션을 포함한 POD를 호스팅함 

### Control Plane Components

- **kube-apiserver**
  - k8s Control Plane의 프론트엔드로서, k8s의 API를 노출함 
  - 우리가 `kubectl`를 실행시켰을때 실질적으로 호출되는 놈이 kube-apiserver 임. 
  - 다음 작업을 수행함 
    - 사용자 인증 및 요청 유효성 검사
    - 데이터 검색 및 업데이트 (etcd에서).
    - kube-apiserver는 etcd와 상호작용하는 유일한 구성 요소임.
    - 다른 구성 요소(예: 스케줄러 및 kubelet)는 etcd에서 데이터에 접근하거나 설정하기 위해 kube-apiserver를 무조건 경유해야 함 

- **ETCD(솔루션 자체)**
  - 단순하고 안전하며 빠른 분산 신뢰성 있는 key-value store
  - 분산 시스템(예: k8s)을 위해 특별히 설계되어, 작고 빠르게 변하는 구성 데이터를 저장함 
  - etcd 공식 [문서](https://etcd.io/docs/)

- **ETCD(k8s에서의 역할)**
  - 노드, POD, 구성, 비밀, 계정, 역할 등, 클러스터관련 정보를 저장 
  - 클러스터에 대한 모든 변경 사항은 etcd 서버에 업데이트됨 
  - 데이터가 etcd 서버에 업데이트된 후에만 변경사항 적용이 완료된 것으로 간주됨 

- **kube-controller-manager**
  - 다양한 Controller들을 k8s의 단일 프로세스에 관리하고 패키징함. 컨트롤러 예제들은 아래와 같음 
    - Node controller: 노드가 다운될 때 이를 인식하고 대응함
    - Job controller: 일회성 작업을 나타내는 Job 객체를 감시한 후, 해당 작업을 완료하기 위해 POD를 생성함
    - EndpointSlice controller: 서비스와 POD 간의 링크를 제공하기 위해 EndpointSlice 객체를 채움
    - ServiceAccount controller: 새로운 네임스페이스를 위한 기본 서비스 계정을 생성함
    - 더 많고 더 복잡함...

- **kube-scheduler**
  - 어떤 POD가 어떤 노드에서 실행될지를 결정함. 
  - 진짜 결정만하고 실제로 POD를 노드에 배치하지는 않음 (그것은 kubelet의 작업임)
  - 어떻게 결정함??
    - 개별 및 집합 자원 요구 사항, 하드웨어/소프트웨어/정책 제약, 친화성 및 비친화성 사양, 데이터 지역화, 작업 간 간섭, 데드라인 등을 고려하여 결정

- **cloud-controller-manager**
  - 로컬에서 k8s를 실행하는 경우 (비 클라우드 환경) 에서는 필요없음 
  - 클러스터를 클라우드 제공업체의 API에 연결.
  - 클라우드 플랫폼과 상호작용하는 구성 요소를 클러스터와만 상호작용하는 구성 요소에서 분리시킴 
  - 클라우드 관련 작업을 기본 Kubernetes 구성 요소와 분리하여, Kubernetes가 AWS, Azure, Google Cloud 등 다양한 클라우드 제공업체와 원활하게 통합될 수 있도록 함 

### Node Component 

- **kubelet**
  - 클러스터의 각 노드에서 실행되는 에이전트로, 마스터 노드와의 유일한 접점으로 다음과 같은 작업을 수행함
    - 노드등록
    - POD 생성
    - POD 내에서 컨테이너가 실행되고 있는지를 확인
    - 노드와 POD를 모니터링
    - 기타...

- **컨테이너 런타임**
  - Kubernetes가 컨테이너를 효과적으로 실행할 수 있도록 하는 기본 구성 요소. 
  - Kubernetes 환경 내에서 컨테이너의 실행 및 lifecycle을 관리함
  - k8s 에서 만든 CRI (Container Runetime Interface)를 구현한 모든 컨테이너 런타임을 지원함. 
    - containerd, CRI-O, Docker 등 

- **kube-proxy (선택 사항)**
  - k8s 클러스터의 각 노드에서 실행되는 프로세스로, k8s 서비스 개념의 일부를 구현함
  - 클러스터 내에서 모든 POD는 서로 접근할 수 있음. 이는 POD 네트워킹 솔루션에 의해 가능하며, kube-proxy가 이를 담당함
    - 노드에서 네트워크 규칙을 저장 및 유지보수
    - 새로운 서비스를 찾아내며, 새로운 서비스가 생성될 때마다 각 노드에 적절한 규칙을 생성하여 POD 간의 트래픽을 허용함
  - > **왜 선택 사항임?** kube-proxy는 운영 체제의 패킷 필터링 계층을 사용 가능하다면 이를 사용함. 그렇지 않다면 kube-proxy가 직접 트래픽을 전달함.
    > 만약 서비스에 대해 패킷 전달을 자체적으로 구현하고 kube-proxy와 동등한 동작을 제공하는 네트워크 플러그인을 사용하는 경우, 클러스터의 노드에서 kube-proxy를 실행할 필요가 없음.

Reference
https://kubernetes.io/docs/concepts/architecture/#network-plugins
https://www.udemy.com/course/certified-kubernetes-administrator-with-practice-tests/