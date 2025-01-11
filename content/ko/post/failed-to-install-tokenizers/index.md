---
categories:
- Issue Resolution|이슈해결
date: "2024-11-28T20:54:35+09:00"
draft: false
tags: []
title: '[Bug] Tokenizers 설치 실패 (Feat. MacOS)'
---

## Bug

MacOS 에서 파이썬으로 tokenizers를 설치하려다 발생한 버그이다. 처음에는 Rust 컴파일러를 설치하라 하지만, 설치 이후에는 다음과 같은 에러가 발생한다  🥲

```zsh
(exit status: 1)
      cargo rustc --lib --message-format=json-render-diagnostics --manifest-path Cargo.toml --release -v --features pyo3/extension-module --crate-type cdylib -- -C link-args=-undefined dynamic_lookup -Wl,-install_name,@rpath/tokenizers.cpython-38-darwin.so
      error: `cargo rustc --lib --message-format=json-render-diagnostics --manifest-path Cargo.toml --release -v --features pyo3/extension-module --crate-type cdylib -- -C 'link-args=-undefined dynamic_lookup -Wl,-install_name,@rpath/tokenizers.cpython-38-darwin.so'` failed with code 101
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.
  ERROR: Failed building wheel for tokenizers
Failed to build tokenizers
ERROR: ERROR: Failed to build installable wheels for some pyproject.toml based projects (tokenizers)
```

## Solution
Upgrade the `tokenizers` version.

or

Set `RUSTFLAGS` env to the following
```zsh
export RUSTFLAGS="-A invalid_reference_casting"
```

이후 다시 설치하면 정상적으로 동작한다.  😆





## Refererence

https://github.com/neonbjb/tortoise-tts/issues/728