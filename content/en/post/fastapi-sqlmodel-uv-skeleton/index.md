+++
date = '2025-01-07T21:05:57+09:00'
draft = false
title = 'Implementing a Simple API Server with FastAPI, SQLModel, and UV'
tags = ["fastapi","uv","sqlmodel"]
categories = ["dev|개발"]
+++

Let's create a skeleton code for an API server using the following tech stack:
- [uv](https://docs.astral.sh/uv/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLModel](https://sqlmodel.tiangolo.com/)
- PostgreSQL

## Project Setup

 Installing `uv`

```zsh
curl -LsSf https://astral.sh/uv/install.sh | sh
```

 Creating the Project

```zsh
mkdir fastapi-sqlmodel-postgresql-skeleton && cd fastapi-sqlmodel-postgresql-skeleton
uv init
Initialized project `fastapi-sqlmodel-postgresql-skeleton`
```

 (Optional) Setting Up Linting and Formatting with Ruff

```zsh
uv add ruff --dev
uv run ruff check  # Linting
uv run ruff format .  # Formatting
```

Refer to the [Ruff configuration documentation](https://docs.astral.sh/ruff/configuration/) for customization.

## Running FastAPI

 Installing Required Packages

```zsh
uv add fastapi uvicorn
```

 Writing and Running `main.py`

```python
# app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with uv!"}
```

Run the server:

```zsh
uv run uvicorn app.main:app --reload
```

Output:
```zsh
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [33119] using StatReload
INFO:     Started server process [33123]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

## Using `.env` for Environment Variables

 Installing Required Packages

```zsh
uv add python-dotenv pydantic-settings
```

 Writing Configuration Code

```python
# app/config/settings.py
import os
from pydantic import Field, computed_field
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

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

 Creating `.env` File

```yaml
# .env
APP_NAME=APP_NAME
APP_VERSION=0.1.0

DATABASE_PROTOCOL=postgresql+psycopg2
DATABASE_USER=myuser
DATABASE_PASSWORD=mypassword
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mydatabase
```

 Adding Settings API to `main.py`

```python
# app/main.py
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

Run the server:

```zsh
uv run uvicorn app.main:app --reload
```

Call `/settings` API and verify the response.

## Connecting to PostgreSQL

Refer to [this guide](run-postgresl-docker-container) for running PostgreSQL in a Docker container.

 Installing Database Packages

```zsh
uv add sqlmodel psycopg2-binary
```

 Writing Database Code

```python
# app/database.py
from typing import Annotated
from fastapi import Depends
from sqlmodel import create_engine, Session, SQLModel
from app.config.settings import db_settings

engine = create_engine(db_settings.url, echo=True)

def get_session() -> Session:
with Session(engine) as session:
yield session

db_dependency = Annotated[Session, Depends(get_session)]
```

 Creating Tables in `main.py`

```python
# app/main.py
from sqlmodel import SQLModel
from app.database import engine

SQLModel.metadata.create_all(engine)
```

Run the server:

```zsh
uv run uvicorn app.main:app --reload
```

If no errors occur, the database connection is successful.

## Implementing CRUD

 Writing the Model

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

 Writing CRUD APIs

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

 Registering the Router

```python
# app/main.py
from app.api.v1.router.person import router as person_router

app.include_router(person_router, prefix="/api/v1/persons", tags=["Persons"])
```

Run the server:

```zsh
uv run uvicorn app.main:app --reload
```

Access the API at `/docs` and test the CRUD functionality!

## CRUD Execution

Run the server:

```zsh
uv run uvicorn app.main:app --reload
```

Navigate to `https://localhost:8000/docs` and test the API.

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

By creating a basic CRUD API server like this, you can easily expand and customize it to suit future needs. 😊


Source code can be found in https://github.com/maxkangdev/fastapi-sqlmodel-postgresql-skeleton