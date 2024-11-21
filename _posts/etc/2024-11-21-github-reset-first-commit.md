---
title: \[github\] How to reset the initial commit softly 
categories:
  - etc
tags:
  - github
date: 2024-11-21
last_modified_at: 2024-11-21
---

This will not work for the initial commit 😨
```zsh
git reset --soft HEAD~1
```

Do this instead. (Don't worry it will reset softly) 😊
```
git update-ref -d HEAD
```

