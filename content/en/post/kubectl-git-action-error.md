+++
date = '2024-12-27T20:39:50+09:00'
draft = false
title = '[Git Action] kubectl config error'
tags = ['kubernetes','git action']
categories = ["Issue Resolution|이슈해결"]
+++

In order to run `kubectl` in git action, you can use [actions-hub/kubectl](https://github.com/actions-hub/kubectl) as shown below.  

Get your kubeconfig file by running `cat $HOME/.kube/config | base64` and set it as KUBE_CONFIG in github secret. 

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

### Error
Suppose your cluster IP changed, so your KUBE_CONFIG also has to change now.      
When you update your KUBE_CONFIG and run the above git action, it will not work.    
It will use the previous KUBE_CONFIG... 🤬

### Cause & Reolution
Currently, `actions-hub/kubectl` is caching the KUBE_CONFIG and uses the value in git action only if config does not exist,  
thus making updated KUBE_CONFIG useless...  

In order to fix this, you have to access git action runner and remove the existing config...  
(This might not be a problem, if you are using a externally managed runner which resets itself everytime it runs)  


Someone has made a [PR](https://github.com/actions-hub/kubectl/pull/24), which addresses this issue but it is not merged at the time of this post 😭.  
So you will have to remove existing config manually...


Hope this helps 😄








