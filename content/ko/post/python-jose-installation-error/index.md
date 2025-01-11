---
categories:
- Issue Resolution|이슈해결
date: "2024-12-08T11:11:43+09:00"
draft: false
tags:
- python
- fastapi
title: Python Jose Installation Error
---

`pip install jose` 로 설치하면 다음과 같은 에러가 발생한다. 

```zsh
SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?
```

아래 커맨드로 설치해라 :) 

```zsh 
pip uninstall joes 
pip install "python-jose[cryptography]"
```