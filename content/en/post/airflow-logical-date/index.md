---
categories:
  - Issue Resolution|이슈해결
date: 2025-01-11T15:04:43+09:00
draft: false
tags:
  - airflow
title: "[Airflow] run이 queueing 되지만 running으로 넘어가지 않는 경우"
---

## Problem

After setting up Airflow, triggering a DAG via `POST /dags/run_id/dagRuns` results in the run being queued, but it does not transition to the running state.

## Cause and Solution

1. Check the time settings in Airflow.  
2. Verify the `logical_date` in the body of `POST /dags/run_id/dagRuns`.

In my case, Airflow was configured to use UTC, but the `logical_date` was being sent in KST. This mismatch caused the run not to execute.  

After changing the `logical_date` to UTC, everything worked as expected! :)