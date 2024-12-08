+++
date = '2024-12-05T10:47:50+09:00'
draft = false
title = '도커 컨테이너로 postgres 띄우는 방법'
tags = ["docker","postgres"]
categories = ["DevOps"]
+++

### 아래 shell 파일을 작성합니다. 

`run-postgres-docker-container.sh`
```sh
#!/bin/bash

# Variables
CONTAINER_NAME="my_postgres"
POSTGRES_USER="myuser"
POSTGRES_PASSWORD="mypassword"
POSTGRES_DB="mydatabase"
POSTGRES_PORT="5432"

# Check if the container is already running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "PostgreSQL container '$CONTAINER_NAME' is already running."
else
    # Check if the container exists but is stopped
    if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
        echo "Starting existing PostgreSQL container '$CONTAINER_NAME'..."
        docker start $CONTAINER_NAME
    else
        echo "Creating and starting a new PostgreSQL container '$CONTAINER_NAME'..."

        docker run -d \
            --name $CONTAINER_NAME \
            -e POSTGRES_USER=$POSTGRES_USER \
            -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
            -e POSTGRES_DB=$POSTGRES_DB \
            -p $POSTGRES_PORT:5432 \
            -v postgres_data:/var/lib/postgresql/data \
            postgres:13
    fi

    # Check if the container started successfully
    if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
        echo "PostgreSQL container '$CONTAINER_NAME' is running."
    else
        echo "Failed to start PostgreSQL container."
    fi
fi
```

### 실행

```zsh
chmod +x run-postgres-docker-container.sh    
./run-postgres-docker-container.sh

Creating and starting a new PostgreSQL container 'my_postgres'...
Unable to find image 'postgres:13' locally
13: Pulling from library/postgres
bb3f2b52e6af: Download complete
5aa7c759ac41: Download complete
e27ad346e3d5: Download complete
ac65a950b085: Download complete
3b54683df903: Download complete
cb2aa8bf62d6: Download complete
7a9d97770021: Download complete
c62d14e3c5db: Download complete
d9e795891602: Download complete
682d2de617aa: Download complete
b26ac3bcc92c: Download complete
f97dcd96cc16: Download complete
92750b18c2d5: Download complete
e2373b6d486d: Download complete
Digest: sha256:13ae5ab08d8400b3002da7495978381b83ad094c24f54d7cd7ddebefc5ac9e64
Status: Downloaded newer image for postgres:13
714d9b89bcba513267837d24892b215e88bf58ffe2426fcaba082bb638cef65a
PostgreSQL container 'my_postgres' is running.
```


### 연결
```zsh
docker exec -it 714d9b89bcba psql -U myuser -d mydatabase
```
  
근데 해당 컨테이너 껏다 켯는데도 데이터가 그대로인 경우가 있다...  
보통 데이터의 경우 관련 볼륨에 따로 저장되기 때문이다. (쓸데없이 잘만들어가지고... 😝)  
  
데이터까지 지우려면 볼륨까지 없애고 다시 시작해라 :) 

```zsh 
docker volume ls 
docker volume rm <volume_name>
```
