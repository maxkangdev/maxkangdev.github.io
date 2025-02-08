---
categories:
  - dev|개발
date: 2025-02-04T10:32:53+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] 함수"
---
## **1. 작은 함수가 좋다**
>함수는 가능한 한 작아야 하며, 10줄을 넘기지 않는 것이 이상적이다.  
작은 함수는 읽기 쉽고, 이해하기 쉬우며, 유지보수도 용이하다.  

#### ✅ **좋은 예제 (작은 함수)**
```python
def get_user_full_name(user):
    return f"{user['first_name']} {user['last_name']}"

def print_user_info(user):
    full_name = get_user_full_name(user)
    print(f"User: {full_name}, Age: {user['age']}")
```
- `get_user_full_name()` 함수는 사용자 이름을 조합하는 한 가지 역할만 수행함.
- `print_user_info()` 함수는 사용자 정보를 출력하는 역할만 수행함.
- 각 함수가 작고, 명확하며, 한 가지 작업에 집중됨.

#### ❌ **나쁜 예제 (큰 함수)**
```python
def print_user_info(user):
    full_name = f"{user['first_name']} {user['last_name']}"
    print(f"User: {full_name}, Age: {user['age']}")
```
- 이름을 조합하는 로직과 출력하는 로직이 섞여 있음.
- 함수가 여러 가지 역할을 수행하여 유지보수가 어려움.

## **2. 한 가지 일만 하라**
> 함수는 오직 하나의 일만 해야 한다.  
> 이 규칙은 함수가 여러 가지 역할을 하지 않도록 보장하여 코드의 이해도를 높이고 유지보수를 용이하게 만든다.  
> 여러 일을 처리하려고 하지 말고, 하나의 일에 집중하라.

#### ✅ **좋은 예제 (한 가지 일만 하는 함수)**
```python
def calculate_area(radius):
    return 3.14 * radius * radius

def print_area(radius):
    area = calculate_area(radius)
    print(f"The area is {area}")
```
- `calculate_area()` 함수는 원의 면적만 계산하는 일을 담당함.
- `print_area()` 함수는 면적을 출력하는 일만 담당함.
- 각 함수가 하나의 일에 집중하고 있어 코드가 명확하고 간단함.

#### ❌ **나쁜 예제 (여러 가지 일을 하는 함수)**
```python
def process_and_print_area(radius):
    area = 3.14 * radius * radius
    print(f"The area is {area}")
    # 다른 작업 추가 가능 (예: 로그 기록, 데이터 저장 등)
```
- `process_and_print_area()` 함수는 면적 계산뿐만 아니라 출력, 로그 기록 등 여러 가지 일을 처리함.
- 여러 가지 일이 한 함수에 몰려 있어 이해하기 어려워지고, 유지보수가 힘들어짐.

## **3. 함수의 인수는 최소화하라**
> 함수의 인수는 가능한 한 적게 유지해야 한다.  
> 많은 인수를 받는 함수는 복잡하고 사용하기 어려워진다. 함수가 받는 인수가 많을수록 이해하기 어려워지고, 실수할 가능성도 커진다.  
> 인수를 줄이기 위한 방법으로는 객체나 구조체를 사용하는 것이 좋다.

#### ✅ **좋은 예제 (적은 인수)**
```python
def calculate_total_price(price, quantity):
    return price * quantity

def print_receipt(price, quantity):
    total_price = calculate_total_price(price, quantity)
    print(f"Total Price: {total_price}")
```
- `calculate_total_price()` 함수는 두 개의 인수(가격, 수량)만 받으며, 그 역할이 명확하고 간단함.
- `print_receipt()` 함수도 가격과 수량만을 받아 처리함.
- 인수의 수가 적어 함수가 이해하기 쉬움.

#### ❌ **나쁜 예제 (많은 인수)**
```python
def process_order(price, quantity, customer_name, customer_address, discount, tax_rate):
    total_price = price * quantity
    total_price_after_discount = total_price - discount
    total_price_with_tax = total_price_after_discount * (1 + tax_rate)
    print(f"Customer: {customer_name}, Address: {customer_address}, Total: {total_price_with_tax}")
```
- `process_order()` 함수는 6개의 인수를 받아 여러 작업을 처리함.
- 인수가 너무 많아져 함수가 복잡해지고, 실수를 유발할 가능성이 커짐.
- 함수의 역할이 분명하지 않으며, 변경 시 영향 범위가 커짐.

## **4. 부수효과를 일으키지 말아라**
> 부수효과란 함수 외부의 상태를 변경하는 행위를 말한다.  
> 함수는 가능한 한 입력값에만 의존하고, 함수 외부의 상태나 데이터를 변경하지 않도록 해야 한다.  
> 부수효과가 없으면 함수의 예측 가능성이 높아지고, 코드의 유지보수가 용이해진다.

#### ✅ **좋은 예제 (부수효과가 없는 함수)**
```python
def calculate_area(radius):
    return 3.14 * radius * radius

def print_area(radius):
    area = calculate_area(radius)
    print(f"The area is {area}")
```
- `calculate_area()` 함수는 입력값인 `radius`에만 의존하고, 외부 상태를 변경하지 않음.
- `print_area()` 함수도 `calculate_area()`의 결과를 출력하는 역할만 수행함.
- 두 함수는 부수효과 없이 독립적으로 작동하며 예측 가능함.

#### ❌ **나쁜 예제 (부수효과가 있는 함수)**
```python
def calculate_area_and_update_log(radius):
    area = 3.14 * radius * radius
    with open("log.txt", "a") as log_file:
        log_file.write(f"Calculated area: {area}\n")
    return area
```
- `calculate_area_and_update_log()` 함수는 면적을 계산하는 것 외에도 파일을 수정하는 부수효과를 일으킴.
- 함수가 외부 상태(파일)를 변경하고 있기 때문에 예측이 어려워지고, 테스트가 복잡해짐.
- 부수효과를 없애면 함수의 역할이 더 명확하고 독립적이게 됨.

## **5. 명령과 조회를 분리하라**
> 명령은 상태를 변경하는 작업을 수행하고, 조회는 상태를 변경하지 않고 값을 반환하는 작업을 수행해야 한다.  
> 명령과 조회를 분리하면 함수의 역할이 명확해지고, 코드가 더 직관적이고 유지보수가 용이해진다.

#### ✅ **좋은 예제 (명령과 조회를 분리한 경우)**
```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, item):
        self.items.append(item)

    def get_item_count(self):
        return len(self.items)
```
- `add_item()` 함수는 상태를 변경하는 명령이며, 장바구니에 아이템을 추가한다.
- `get_item_count()` 함수는 상태를 변경하지 않고, 장바구니의 아이템 수를 반환하는 조회 함수이다.
- 명령과 조회가 분리되어 함수의 역할이 명확함.

#### ❌ **나쁜 예제 (명령과 조회가 혼합된 경우)**
```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item_and_get_count(self, item):
        self.items.append(item)
        return len(self.items)
```
- `add_item_and_get_count()` 함수는 아이템을 추가하고 그와 동시에 아이템의 수를 반환하는 조회 역할까지 수행함.
- 명령과 조회가 혼합되어 있어 함수가 두 가지 일을 하고 있으며, 역할이 분명하지 않음.
- 이로 인해 함수의 변경이나 테스트가 어려워짐.

## **6. 오류코드보다 예외를 사용하라**
> 오류가 발생했을 때 오류 코드를 반환하는 대신, 예외를 사용하여 오류를 처리하는 것이 좋다.  
> 예외를 사용하면 오류가 발생한 위치와 원인을 명확히 추적할 수 있고, 코드 흐름을 더 직관적으로 만들 수 있다. 오류 코드로 처리하는 방식은 오류를 무시하거나 처리하지 않게 만들 수 있어, 예외를 통해 오류를 명확히 다루는 것이 더 바람직하다.

#### ✅ **좋은 예제 (예외 사용)**
```python
class InsufficientFundsError(Exception):
    pass

def withdraw(amount, balance):
    if amount > balance:
        raise InsufficientFundsError("잔액이 부족합니다.")
    return balance - amount
```
- `withdraw()` 함수는 잔액이 부족하면 예외를 발생시켜 명확하게 오류를 처리함.
- 예외를 사용하여 오류를 던지고, 호출하는 쪽에서 이를 처리하도록 유도함.
- 오류 상황이 명확하게 드러나고, 코드 흐름이 자연스러움.

#### ❌ **나쁜 예제 (오류 코드 사용)**
```python
def withdraw(amount, balance):
    if amount > balance:
        return -1  # 오류 코드 반환
    return balance - amount
```
- `withdraw()` 함수는 잔액이 부족하면 오류 코드를 반환함.
- 호출하는 쪽에서 오류 코드를 확인하고 처리해야 하므로 코드가 복잡하고 오류 처리가 명확하지 않음.
- 오류 코드로 처리하는 방식은 예외를 발생시키는 것보다 오류를 무시하거나 제대로 처리하지 못할 위험이 있음.


## **7. 예외 처리는 한곳에서 하라**
> **예외 처리는 함수의 핵심 로직을 흐리지 않도록 별도의 함수로 분리하는 것이 좋다.**

 **✅ 좋은 예제**
```java
public void processOrder(Order order) {
    try {
        handleOrder(order);
    } catch (Exception e) {
        logError(e);
    }
}

private void handleOrder(Order order) {
    // 주문 처리 로직
}

private void logError(Exception e) {
    System.out.println("Error occurred: " + e.getMessage());
}

```
- **예외 처리 로직을 별도 함수로 분리**하여 핵심 로직이 깔끔해짐.

 **❌ 나쁜 예제**
```java
public void processOrder(Order order) {
    try {
        // 주문 처리
    } catch (Exception e) {
        System.out.println("Error occurred: " + e.getMessage());
    }
}
```
- **주문 처리 로직과 예외 처리가 섞여 있어서 가독성이 떨어짐**.

## **8. 중복을 피하라**
> 코드에서 중복을 피하는 것이 중요하다. 동일한 코드가 여러 곳에 존재하면, 코드의 수정이나 확장이 어려워지고 오류가 발생할 가능성이 높아진다.  
> 중복을 피하려면 공통된 로직을 함수나 클래스로 추출하여 재사용할 수 있게 해야 한다.

#### ✅ **좋은 예제 (중복을 피한 코드)**
```python
def calculate_discount(price, discount_rate):
    return price * (1 - discount_rate)

def calculate_final_price(price, discount_rate, tax_rate):
    discounted_price = calculate_discount(price, discount_rate)
    final_price = discounted_price * (1 + tax_rate)
    return final_price
```
- `calculate_discount()` 함수는 가격에 할인을 적용하는 로직을 하나의 함수로 분리하여 재사용 가능하게 만듦.
- `calculate_final_price()`에서는 `calculate_discount()` 함수를 호출하여 중복되는 할인 계산 로직을 피하고, 코드가 깔끔하고 이해하기 쉬움.
- 중복된 코드가 없고, 변경이 필요할 때 한 곳에서만 수정하면 됨.

#### ❌ **나쁜 예제 (중복된 코드)**
```python
def calculate_final_price(price, discount_rate, tax_rate):
    discounted_price = price * (1 - discount_rate)  # 중복된 할인 계산 로직
    final_price = discounted_price * (1 + tax_rate)
    return final_price

def calculate_final_price_v2(price, discount_rate, tax_rate):
    discounted_price = price * (1 - discount_rate)  # 중복된 할인 계산 로직
    final_price = discounted_price * (1 + tax_rate)
    return final_price
```
- `calculate_final_price()`와 `calculate_final_price_v2()` 두 함수에 동일한 할인 계산 로직이 중복되어 있음.
- 코드가 중복되어 유지보수가 어려워지고, 할인 계산 로직이 변경될 때 두 함수 모두 수정해야 하는 불편함이 있음.
- 중복을 피하려면 공통된 로직을 함수로 분리하여 재사용해야 함.


##  함수 짤때 해야하는 질문들?

1. 함수가 너무 크지는 않나?
2. 함수가 하는 일이 너무 많지는 않나?
3. 함수의 인수를 더 줄일수 있는 방법이 있나?
4. 함수의 이름과 다르게 부수효과가 일어나는 부분이 있나?
5. 본 함수는 명령인가? 조회인가?
6. 오류코드를 사용하나? (사용하고 있다면 예외로 변경하자)
7. 예외처리가 중구난방으로 퍼져있나?
8. 중복되는 코드가 있나? 

요 정도만 생각하면서 코드를 짜도 나름 나쁘지 않은 코드가 될 것 같습니다 😃



## Reference
클린코드 by 로버트 C. 마틴