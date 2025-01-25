---
categories:
  - DevOps
date: 2025-01-12T22:07:12+09:00
draft: false
tags:
  - network
  - docker
title: "[Docker] Network"
---

## Networking Options
When running Docker, there are several options for network configuration.

### None
The container is not connected to any network, making external communication impossible.
```zsh
docker run ubuntu --network none
```

### Host Network
The container is directly connected to the host's network. For example, if a container is configured to use port 80, you can access the corresponding web service via `localhost:80`.
```zsh
docker run ubuntu --network host
```

### Bridge (Default Network Driver)
If no specific network is set, the container is connected to the bridge network.
```bash
docker run ubuntu
```

The bridge network is automatically created when Docker is installed.
```zsh
docker network ls
NETWORK ID     NAME      DRIVER    SCOPE  
636e8359c29a   bridge    bridge    local  
3c867a7aaa82   host      host      local  
e47ac0b30be9   none      null      local  
```
- By default, this network uses the `172.17.0.0` address range.
- Devices connected to this network are assigned an IP address within this range, e.g., `172.17.0.2`, `172.17.0.3`, and so on.

### User-Defined Network
By default, Docker creates only the internal bridge network. You can create additional networks with custom IP ranges as needed.
```zsh
docker network create --driver bridge --subnet 182.18.0.0/16 my-network  

NETWORK ID     NAME         DRIVER    SCOPE  
636e8359c29a   bridge       bridge    local  
3c867a7aaa82   host         host      local  
24eaacf70800   my-network   bridge    local  
e47ac0b30be9   none         null      local  
```

To check the IP address of a custom network (e.g., the subnet):
```zsh
docker inspect my-network  

[  
    {  
        "Name": "my-network",  
        "Id": "24eaacf70800544ec3ce67c089a8f9bd641d25a91970c23835187e38f9bbbdc8",  
        "Created": "2025-01-24T07:53:24.880072262Z",  
        "Scope": "local",  
        "Driver": "bridge",  
        "EnableIPv6": false,  
        "IPAM": {  
            "Driver": "default",  
            "Options": {},  
            "Config": [  
                {  
                    "Subnet": "182.18.0.0/16"  
                }  
            ]  
        },  
        "Internal": false,  
        "Attachable": false,  
        "Ingress": false,  
        "ConfigFrom": {  
            "Network": ""  
        },  
        "ConfigOnly": false,  
        "Containers": {},  
        "Options": {},  
        "Labels": {}  
    }  
]  
```

Containers within the same network can communicate with each other using either their IP addresses or container names.

> Docker has a built-in DNS server that makes this possible. Its address is fixed at `127.0.0.11`.


