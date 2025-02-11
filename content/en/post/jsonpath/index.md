---
categories:
  - dev|개발
date: 2025-02-10T22:29:05+09:00
draft: false
tags:
  - jsonpath
title: What is JsonPath?
---

## **What is JsonPath?**  
**JsonPath** is a query language used for navigating and extracting values from JSON data. Just like SQL is used to query databases, JsonPath allows you to easily find specific elements in a JSON document.  

It is primarily used for the following purposes:  
- **Extracting specific fields from API response data**  
- **Searching for specific values in JSON-formatted log files**  
- **Querying values with specific conditions in JSON databases (NoSQL)**  

## Basic Syntax  
- `$` Root  
- `[#]` Get the `#`-th element from a list  
- `[#:#:#]` Start:End:Step  
- `[*]` Get all elements from a list  
- `*` Get all properties  
- `?()` Conditional check  
- `@` Each item in the list  

## Examples  
```zsh
$.bus.price                 # Get the price of the bus  
$.bus[2].price              # Get the price of the second bus  
$[1,3]                      # Get the 1st and 3rd elements  
$[1:3]                      # Get elements from index 1 to 3  
$[1:8:2]                    # Get elements from index 1 to 8, stepping by 2  
$[-1]                       # Get the last element  
$[-3:]                      # Get the last 3 elements  
$[-2:2]                     # Get the last 2 and first 2 elements  
$[*]                        # Get all elements from the list  
$.*                         # Get all properties  
$.*.price                   # Get the price of all items  

$[?(@>40)]                  # Check if each item in the list is greater than 40  
$[?(@==40)]                 # Check if each item in the list is 40  
$[?(@ in [40,43,45])]       # Check if each item in the list is in [40,43,45]  
$[?(@ nin [40,43,45])]      # Check if each item in the list is not in [40,43,45]  
```

## Querying JSON Files with JsonPath
```bash
cat <file-path> | jpath <query>  
# Example: cat q2.json | jpath $.property1  
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

