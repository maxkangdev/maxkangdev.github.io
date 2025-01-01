+++
date = '2025-01-01T11:31:42+09:00'
draft = false
title = '[Database] Postgresql Cheatsheet'
tags = ["postgresql"]
categories = ["database"]
+++

### Cheatsheet 

`psql -U username` Login

`\c db_name` connect to db
`\l` list all db
`\du` list all users
`\dn` list all schemas
`\q` quit

`\dt` list all tables
`\dt+` list all tables (with more info)
`\dt table_name` get detailed info on table

`\df` list all stored procedures
`\db` list all views dh