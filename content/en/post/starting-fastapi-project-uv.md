+++
date = '2024-12-05T10:57:12+09:00'
draft = false
title = 'Setting Up Fastapi Project using UV'
tags = ["fastapi","uv","python"]
categories = ["dev|개발"]
+++

## What is uv?

An extremely fast Python package and project manager, written in Rust.
{{< figure src="/image/uv.png" alt="alt" width="400" height="150" >}}
`Github` [https://github.com/astral-sh/uv](https://github.com/astral-sh/uv)    
`Doc` [https://docs.astral.sh/uv/](https://docs.astral.sh/uv/)



If you are starting a new python project or considering to refactor existing python project,
you should defintely consder `uv`.

You will be surprised by its speed ⚡⚡⚡️

## Installation

```zsh
# Install 
curl -LsSf https://astral.sh/uv/install.sh | sh

uv
An extremely fast Python package manager.

Usage: uv [OPTIONS] <COMMAND>
```

```zsh
# Uninstall
uv cache clean
rm -r "$(uv python dir)"
rm -r "$(uv tool dir)"

rm ~/.local/bin/uv ~/.local/bin/uvx
```

### Start Project


```zsh
# uv init <project name>
uv init test 
Initialized project `test` at `/Users/user/code/test`

ls test 
README.md	hello.py	pyproject.toml
```

### Add FastAPI

```zsh 
uv add fastapi uvicorn 
```

### (Optional) Configure Ruff for Linting & Formatting
```zsh
uv add ruff 

uv run ruff check # lint
uv run ruff format . # format
```
Reference https://docs.astral.sh/ruff/configuration/ to configure ruff

### Create main.py and Run it

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

visit [https://localhost:8000](https://localhost:8000)

