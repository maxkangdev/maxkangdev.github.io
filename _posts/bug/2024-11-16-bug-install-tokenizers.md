---
title: \[Bug\] Failed to install tokenizers python library
categories:
  - bug
tags:
  - bug
  - python
date: 2024-11-15
last_modified_at: 2024-11-15
---


## Bug
Following error occured when attempting to install `tokenizers` even after installing rust compiler. 🥲

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

and try installing it again 😆





## Refererence 

https://github.com/neonbjb/tortoise-tts/issues/728