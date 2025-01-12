---
categories:
  - Issue Resolution|이슈해결
date: 2025-01-11T15:04:43+09:00
draft: false
tags:
  - airflow
title: "[Airflow] run이 queueing 되지만 running으로 넘어가지 않는 경우"
---

##  문제 

Airflow를 셋업한 이후, `POST /dags/run_id/dagRuns` 를 통해 DAG를 trigger 했을때, queueing이 되지만 이후 running으로 넘어가지 않는 경우가 있음

##  원인 및 해결책

1. Airflow 의 시간 설정 확인   
2. 이후 `POST /dags/run_id/dagRuns` 의 body 에서 `logical_date`을 확인

필자의 경우 Airflow는 UTC 기준으로 설정되었지만, logical_date을 KST 기준으로 보내서 실행이 되지 않고 있었음

`logical_date`을 UTC로 변경해주니 정상동작함 :) 




