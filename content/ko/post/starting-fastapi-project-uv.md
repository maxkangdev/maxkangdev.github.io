+++
date = '2024-12-05T10:57:12+09:00'
draft = false
title = 'UV를 사용한 FastAPI 프로젝트 설정'
tags = ["fastapi","uv"]
categories = ["dev|개발"]
+++

## UV란?

Rust로 작성된 매우 빠른 Python 패키지 및 프로젝트 관리 도구입니다.
{{< figure src="/image/uv.png" alt="alt" width="400" height="150" >}}
`Github` [https://github.com/astral-sh/uv](https://github.com/astral-sh/uv)    
`Doc` [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)

새로운 파이썬 프로젝트를 시작하거나 기존 프로젝트를 리팩토링하려고 한다면, `uv`를 고려해봐라. 개빠르다.... ⚡️⚡️⚡️

## 설치 방법

```zsh
# 설치 
curl -LsSf https://astral.sh/uv/install.sh | sh

uv
매우 빠른 Python 패키지 관리자.

사용법: uv [OPTIONS] <COMMAND>
```

```zsh
# 제거
uv cache clean
rm -r "$(uv python dir)"
rm -r "$(uv tool dir)"

rm ~/.local/bin/uv ~/.local/bin/uvx
```

### 프로젝트 시작

```zsh
# uv init <프로젝트 이름>
uv init test 
프로젝트 `test`가 `/Users/user/code/test`에 초기화되었습니다.

ls test 
README.md	hello.py	pyproject.toml
```

### FastAPI 추가

```zsh 
uv add fastapi uvicorn 
```

### (Optional) Ruff를 사용한 린팅 및 포매팅 설정
```zsh
uv add ruff 

uv run ruff check # 린트
uv run ruff format . # 포매팅
```
Ruff 설정을 https://docs.astral.sh/ruff/configuration/ 보고 알아서 하도록.

### main.py 작성 및 실행

```zsh
# src/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI with uv!"}
```

```zsh
uv run uvicorn src.main:app --reload
```

[https://localhost:8000](https://localhost:8000)를 방문하세요.
```