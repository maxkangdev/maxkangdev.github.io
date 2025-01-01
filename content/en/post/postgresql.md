+++
date = '2025-01-01T11:31:42+09:00'
draft = false
title = '[Database] Postgresql Cheatsheet'
tags = ["postgresql"]
categories = ["database"]
+++
### Cheatsheet 

```python
psql -U username    Login  

\c db_name          Connect to db  
\l                  List all db  
\du                 List all users  
\dn                 List all schemas  
\q                  Quit  

\dt                 List all tables  
\dt+                List all tables (with more info)  
\dt table_name      Get detailed info on table  

\df                 List all stored procedures  
\db                 List all views
```