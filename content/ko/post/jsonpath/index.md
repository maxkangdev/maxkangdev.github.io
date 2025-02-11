---
categories:
  - dev|개발
date: 2025-02-10T22:29:05+09:00
draft: false
tags:
  - jsonpath
title: JsonPath란?
---
## **JsonPath란?**
**JsonPath**는 JSON 데이터를 탐색하고 값을 추출하기 위한 쿼리 언어입니다. SQL에서 데이터를 조회하는 것처럼, JsonPath를 사용하면 JSON 문서에서 특정 요소를 쉽게 찾을 수 있습니다.

주로 아래와 같은 기능들에 사용됨
- **API 응답 데이터에서 특정 필드 추출**
- **로그 파일(JSON 형식)에서 특정 값 검색**
- **JSON 데이터베이스(NoSQL)에서 특정 조건의 값 검색**

## 기본 문법 
- `$` Root
- `[#]` get # element from list
- `[#:#:#]` start:end:step
- `[*]` get all element from list 
- `*` get all properties 
- `?()` check if
- `@` each item in the list

## 예제
```zsh
$.bus.price                 # get price of bus 
$.bus[2].price              # get price of second bus
$[1,3]                      # get 1 and 3 element
$[1:3]                      # get 1 ~ 3 element
$[1:8:2]                    # get 1 ~ 8, stepping 2 
$[-1]                       # get last element
$[-3:]                      # get last 3 element
$[-2:2]                     # get last 2 and first 2 element
$[*]                        # get all elements from list 
$.*                         # get all properties 
$.*.price                   # get price of all  

$[?(@>40)]                  # check if each item in the list is greater than 40 
$[?(@==40)]                 # check if each item in the list is 40
$[?(@ in [40,43,45])]       # check if each item in the list is in [40,43,45]
$[?(@ nin [40,43,45])]      # check if each item in the list is not in [40,43,45]
```

## JsonPath로 json 파일 query 하는 방법 
```bash
cat <file-path> | jpath <query>
# cat q2.json | jpath $.property1
```
### Example 1
```zsh
# a.json
{
    "car": {
        "color": "blue",
        "price": "$20,000"
    },
    "bus": {
        "color": "white",
        "price": "$120,000"
    }
}

---
# zsh 
cat a.json | jpath $.bus.price
[
  "$120,000"
]
```
### Example 2
```zsh
# b.json
[
    "car",
    "bus",
    "truck",
    "bike"
]

---
cat b.json | jpath '$[0,3]'
[
  "car",
  "bike"
]
```

## Good Quiz References
- [https://mmumshad.github.io/json-path-quiz/index.html#!/?questions=questionskub1](https://mmumshad.github.io/json-path-quiz/index.html#!/?questions=questionskub1)
- [https://mmumshad.github.io/json-path-quiz/index.html#!/?questions=questionskub2](https://mmumshad.github.io/json-path-quiz/index.html#!/?questions=questionskub2)