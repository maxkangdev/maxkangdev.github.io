+++
date = '2025-01-07T21:05:57+09:00'
draft = true
title = 'FastAPI, SQLModel, UV를 이용한 간단한 API 서버 구현'
tags = ["fastapi","uv","sqlmodel"]
categories = ["dev|개발"]
+++

다음 기술스택들을 사용해서 API서버 skeleton 코드를 짜보자 :) 
- [uv](https://docs.astral.sh/uv/) 
- [FastAPI](https://fastapi.tiangolo.com/)  
- [SQLModel](https://sqlmodel.tiangolo.com/)
- Postgresql

## 프로젝트 셋업 

uv 설치
```zsh
curl -LsSf https://astral.sh/uv/install.sh | sh
```

프로젝트 생성 
```zsh
mkdir fastapi-sqlmode-postgresql-skeleton && cd fastapi-sqlmode-postgresql-skeleton
uv init
Initialized project `fastapi-sqlmode-postgresql-skeleton`
```

(Optional) Ruff를 사용한 린팅 및 포매팅 설정
```zsh
uv add ruff --dev # Add ruff as dev dependencies 

uv run ruff check # 린트
uv run ruff format . # 포매팅
```
Ruff 설정은 https://docs.astral.sh/ruff/configuration/ 보고 알아서 하도록.

## FastAPI 실행 

패키지 설치 
```zsh
uv add fastapi uvicorn 
```

main.py 작성 및 실행
```zsh
# app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with uv!"}
```

서버 실행 
```zsh
uv run uvicorn app.main:app --reload
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [33119] using StatReload
INFO:     Started server process [33123]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## .env 활용 환경변수 설정 

패키지 설치
```zsh
uv add python-dotenv pydantic-settings
```

`.env`를 이용한 settings instance 생성을 위한 코드 작성 
```python 
#app/config/settings.py

import os
from pydantic import Field, computed_field
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

# 환경 변수 파일 로딩
load_dotenv()


class CommonSettings(BaseSettings):
    NAME: str = "App"
    VERSION: str
    ALLOW_ORIGINS: list[str] = ["*"]

    model_config = SettingsConfigDict(
        env_prefix="APP_",
        env_file=os.getenv("ENV_FILE", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


class DatabaseSettings(BaseSettings):
    PROTOCOL: str
    USER: str
    PASSWORD: str = Field(exclude=True)
    HOST: str
    PORT: str
    NAME: str

    model_config = SettingsConfigDict(
        env_prefix="DATABASE_",
        env_file=os.getenv("ENV_FILE", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @computed_field
    @property
    def url(self) -> str:
        return (
            f"{self.PROTOCOL}://{self.USER}:"
            f"{self.PASSWORD}@{self.HOST}:"
            f"{self.PORT}/{self.NAME}"
        )


common_settings = CommonSettings()
db_settings = DatabaseSettings()

```

`.env` 작성
(본 post에서 password는 넣어주었지만, 보통 .env에서는 제외시켜주고 command 실행시 env값으로 넣어주는게 안전합니다 😁 
```yaml
#.env
APP_NAME=APP_NAME
APP_VERSION=0.1.0

DATABASE_PROTOCOL=postgresql+psycopg2
DATABASE_USER=myuser
DATABASE_PASSWORD=mypassword
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mydatabase
```


main.py에 settings API 추가
```zsh
#app/main.py
from fastapi import FastAPI

from app.config.settings import common_settings, db_settings

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with uv!"}


@app.get("/settings")
def read_settings():
    return common_settings, db_settings
```

서버 실행
```zsh
uv run uvicorn app.main:app --reload
```

`/settings` API 호출 이후. 결과값 확인
```zsh
curl -X 'GET' \
  'http://localhost:8000/settings' \
  -H 'accept: application/json'
```
```json
[
  {
    "NAME": "APP_NAME",
    "VERSION": "0.1.0",
    "ALLOW_ORIGINS": [
      "*"
    ]
  },
  {
    "PROTOCOL": "postgresql+psycopg2",
    "USER": "myuser",
    "HOST": "localhost",
    "PORT": "5432",
    "NAME": "mydatabase",
    "url": "postgresql+psycopg2://myuser:mypassword@localhost:5432/mydatabase"
  }
]
```

## 데이터베이스(Postgresql) 연결

먼저 [도커 컨테이너로 postgres 띄우는 방법](run-postgres-docker-container.md)를 참조해서 도커로 postgresql을 띄우자.  

패키지 설치 
```zsh 
uv add sqlmodel psycopg2-binary
```

database.py 작성 
```python
#app/database.py 
from typing import Annotated

from fastapi import Depends
from sqlmodel import create_engine, Session, SQLModel

from app.config.settings import db_settings

# 데이터베이스 엔진 생성
engine = create_engine(db_settings.url, echo=True)


def get_session() -> Session:
    """
    데이터베이스 세션을 생성하여 반환하는 함수입니다.

    이 함수는 FastAPI의 의존성 주입 시스템에 사용됩니다.
    """
    with Session(engine) as session:
        yield session


# 의존성 주입을 위한 타입 힌트
db_dependency = Annotated[Session, Depends(get_session)]
```

테이블 생성 코드  `main.py`에 추가 
```python 
#app/main.py 

app = FastAPI()

# Create tables
SQLModel.metadata.create_all(engine)  # create_db_and_tables
...
```

서버 실행
```zsh
uv run uvicorn app.main:app --reload
```
데이터베이스가 정상적으로 container에서 실행되고, 서버실행시 별다른 에러메시지가 발생하지 않았다면 성공적으로 연결된 거임.  

관련 로그를 보고싶으면 아래처럼 `echo=True`로 세팅해주면 됨. 
```python
engine = create_engine(db_settings.DATABASE_URL, echo=True)
```

## 간단한 CRUD 구현 

Person 클래스를 CRUD 하는 간단한 코드를 작성해보겠음 

모델 코드 작성 
```python
#app/api/models.py
from typing import TypeVar
from uuid import UUID, uuid4

from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from datetime import datetime, timezone


class TableModel(SQLModel):
    created_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        sa_column_kwargs={
            "onupdate": lambda: datetime.now(timezone.utc),
        },
    )


class Person(TableModel, table=True):
    id: UUID = Field(default_factory=lambda: str(uuid4()), primary_key=True)
    name: str
    age: int
    email: str



T = TypeVar("T")


class Response(BaseModel):
    code: int
    reason: str
    data: T
```


Person Router 생성 및 CRUD API 작성 
```python
#app/api/v1/router/person.py
from uuid import UUID

from fastapi import APIRouter
from pydantic import BaseModel

from app.database import db_dependency
from app.api.models import Person, Response

router = APIRouter()


class PersonCreate(BaseModel):
    name: str
    age: int
    email: str


class PersonUpdate(BaseModel):
    name: str
    age: int
    email: str


@router.post("/")
def create_person(person: PersonCreate, db: db_dependency):
    db_person = Person(**person.model_dump())
    db.add(db_person)
    db.commit()
    db.refresh(db_person)

    return Response(code=201, reason="OK", data=db_person)


@router.get("/{_id}")
def get_person(_id: UUID, db: db_dependency):
    db_person = db.get(Person, _id)
    return Response(code=200, reason="OK", data=db_person)


@router.delete("/{_id}")
def delete_person(_id: UUID, db: db_dependency):
    db_person = db.get(Person, _id)

    if db_person:
        db.delete(db_person)
        db.commit()
    return Response(code=200, reason="OK", data=db_person)


@router.put("/{_id}")
def update_person(db: db_dependency, _id: UUID, person: PersonUpdate):
    db_person = db.get(Person, _id)

    db_person.name = person.name
    db_person.age = person.age
    db_person.email = person.email

    db.commit()
    db.refresh(db_person)
    return Response(code=200, reason="OK", data=db_person)
```

App 에 해당 Router 등록 
```python
#app/main.py
...
from app.api.v1.router.person import router as person_v1
app = FastAPI()
SQLModel.metadata.create_all(engine)  # create_db_and_tables
...

...
app.include_router(person_v1, prefix="/api/v1/persons", tags=["Persons"])
```

## CRUD 실행 

서버 실행 
```zsh
uv run uvicorn app.main:app --reload
```
https://localhost:8000/docs 접속 이후 API 테스트 ㄱㄱ 

CREATE
```json
{
  "code": 201,
  "reason": "OK",
  "data": {
    "age": 0,
    "updated_at": "2025-01-08T13:20:33.159349",
    "id": "1d104981-f7c3-4498-b3f3-e90584f19d6e",
    "name": "string",
    "created_at": "2025-01-08T13:20:33.159332",
    "email": "string"
  }
}
```

READ
```json
{
  "code": 200,
  "reason": "OK",
  "data": {
    "age": 0,
    "updated_at": "2025-01-08T13:20:33.159349",
    "id": "1d104981-f7c3-4498-b3f3-e90584f19d6e",
    "name": "string",
    "created_at": "2025-01-08T13:20:33.159332",
    "email": "string"
  }
}
```

UPDATE name 
```json
{
  "code": 200,
  "reason": "OK",
  "data": {
    "age": 0,
    "updated_at": "2025-01-08T13:23:34.469114",
    "id": "1d104981-f7c3-4498-b3f3-e90584f19d6e",
    "name": "new name",
    "created_at": "2025-01-08T13:20:33.159332",
    "email": "string"
  }
}
```
DELETE
```json
{
  "code": 200,
  "reason": "OK",
  "data": {
    "age": 0,
    "updated_at": "2025-01-08T13:23:34.469114",
    "id": "1d104981-f7c3-4498-b3f3-e90584f19d6e",
    "name": "new name",
    "created_at": "2025-01-08T13:20:33.159332",
    "email": "string"
  }
}
```

요런식으로 간단하게 CRUD API 서버를 틀을 만들어 놓으면 나중에 쓰기 편함 :) 

Source code는 https://github.com/maxkangdev/fastapi-sqlmodel-postgresql-skeleton 올려둡니당