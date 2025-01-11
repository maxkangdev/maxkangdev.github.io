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

After installing `jose` via `pip install jose`, you will encounter the following error if you run it. 

```zsh
SyntaxError: Missing parentheses in call to 'print'. Did you mean print(...)?
```

Instead, install it by 

```zsh 
pip uninstall joes 
pip install "python-jose[cryptography]"
```