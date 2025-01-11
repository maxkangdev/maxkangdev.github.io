---
categories:
- Issue Resolution|이슈해결
date: "2024-12-27T20:39:50+09:00"
draft: false
tags:
- kubernetes
- git action
title: '[Git Action] kubectl 설정 에러'
---

Git Action에서 `kubectl`을 실행하려면, 아래 예시와 같이 [actions-hub/kubectl](https://github.com/actions-hub/kubectl)을 사용할 수 있음.

`cat $HOME/.kube/config | base64` 명령어를 실행해 kubeconfig 파일을 얻고, 이를 GitHub secret에 KUBE_CONFIG 로 설정하고 아래 처럼 쓰면됌.

```yaml
name: Get pods
on: [push]

jobs:
  deploy:
    name: Deploy
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions-hub/kubectl@master
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        with:
          args: get pods
```

### 문제

클러스터 IP가 변경되었다고 가정해봐. 이 경우, KUBE_CONFIG도 변경되니 Github Secret도 업데이트 해줘야겠지??   
KUBE_CONFIG를 업데이트한 후 위의 Git Action을 실행하면 실패함....  
로그 체크하면 전에 세팅해두었던 KUBE_CONFIG를 사용하는 장면을 목격하고 삽질을 시작하지 🤬

### 원인 및 해결 방법  
현재 actions-hub/kubectl은 KUBE_CONFIG를 캐시하고 있으며, Git Action에서 config가 존재하지 않는 경우에만 해당 값을 사용함.
따라서 업데이트된 KUBE_CONFIG는 사용을 안함....

이 문제를 해결하려면 Git Action Runner 에 접근하여 기존 config 를 삭제해야 함.
(외부에서 관리되는 Runner를 사용하는 경우, 해당 Runner가 매번 리셋되면 이 문제는 아마 발생하지 않을것임)

누가 이 문제를 해결하는 [PR](https://github.com/actions-hub/kubectl/pull/24)을 만들었지만, 이 글을 쓰는 시점에서는 아직 머지되지 않음 😭.
따라서 해결하려면 기존 config를 수동으로 삭제해야 함...

도움이 되셨길 바랍니다 😄






