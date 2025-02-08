---
categories:
  - dev|개발
date: 2025-02-05T09:19:54+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] 객체와 자료구조"
---
## 1. 객체와 자료구조의 차이점

- **객체(Object)**
    - 데이터(필드)와 행동(메서드)을 함께 캡슐화한다.
    - 내부 데이터는 숨기고, 외부에는 행동(메서드)만을 노출한다.
    - _"데이터를 숨기고 행동을 공개한다."_
- **자료구조(Data Structure)**
    - 데이터만을 포함하며, 별도의 행동(메서드)은 존재하지 않는다.
    - 데이터를 노출하고, 이를 다루는 로직은 데이터 구조를 사용하는 외부 코드에서 처리한다.
    - _"데이터를 공개하고 행동을 숨긴다."_

## 2. 절차적 프로그래밍 vs 객체 지향 프로그래밍

- **절차적 프로그래밍 (Procedural Programming)**
    - 데이터 구조를 공개하고, 함수가 데이터를 조작하도록 설계
    - 새로운 함수(동작)를 추가하는 것이 쉽지만, 새로운 데이터 타입을 추가하는 것은 어렵다.
- **객체 지향 프로그래밍 (Object-Oriented Programming, OOP)**
    - 데이터를 숨기고, 객체의 메서드를 통해서만 접근하도록 설계
    - 새로운 데이터 타입을 추가하는 것이 쉽지만, 새로운 동작(메서드)을 추가하는 것이 어렵다.

> **즉, 객체는 동작을 추가하기 쉬운 반면, 자료구조는 새로운 데이터 타입을 추가하기 어렵다.**  
> → **상황에 따라 적절한 방식을 선택해야 한다.**

## 3. 디미터 법칙 (Law of Demeter)

- **"기차 충돌 (Train Wreck)" 문제**
    - 객체의 내부 구조를 노출하면, 클라이언트 코드가 너무 많은 세부 사항을 알게 된다.
    - `obj.getA().getB().getC().doSomething()` 같은 긴 체인 호출은 유지보수성을 해친다.

#### ❌ 나쁜 예제 (디미터 법칙 위반)

```java
class Person {
    Address address;
    Address getAddress() { return address; }
}

class Address {
    String city;
    String getCity() { return city; }
}

// 클라이언트 코드
Person person = new Person();
String city = person.getAddress().getCity();  // 내부 구조가 드러남
```

#### ✅ 좋은 예제 (캡슐화 적용)

```java
class Person {
    Address address;
    
    String getCity() {  // 내부 구조를 숨기고 메서드 제공
        return address.getCity();
    }
}

// 클라이언트 코드
String city = person.getCity();  // 객체의 내부 구조를 몰라도 됨
```

> **캡슐화를 유지하면, 내부 구조 변경이 클라이언트 코드에 영향을 주지 않는다.**


## 4. 자료구조를 사용할 때는 객체처럼 감싸지 말 것

- 자료구조는 데이터를 공개하는 것이 목적이므로, **객체처럼 행동(메서드)을 추가하려고 하지 말라.**
- 자료구조는 단순한 데이터 컨테이너 역할만 해야 하며, 별도의 로직을 추가하면 안 된다.

#### ❌ 나쁜 예제 (자료구조에 불필요한 동작 추가)

```java
class Point {
    private double x, y;
    
    double calculateDistance(Point other) {  // 데이터 구조에 불필요한 동작 추가
        return Math.sqrt(Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2));
    }
}
```

#### ✅ 좋은 예제 (자료구조는 데이터를 노출하고, 동작은 별도 클래스에서 처리)

```java
class Point {
    double x, y;  // 데이터를 공개
}

class Geometry {
    static double calculateDistance(Point p1, Point p2) {  // 동작을 별도 클래스에 위치
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
}
```

> **자료구조는 데이터를 단순하게 유지하고, 동작을 별도의 서비스나 유틸리티 클래스에서 처리하는 것이 깔끔한 설계다.**

## 5. 객체와 자료구조의 균형 잡기

- **변경이 예상되는 부분**은 **객체 지향적인 방식**을 사용하여 캡슐화해야 한다.
- **변경 가능성이 낮은 부분**은 **자료구조 중심으로 설계**하여 단순함을 유지해야 한다.
- 데이터 구조를 이용하면 새로운 동작을 쉽게 추가할 수 있으며, 객체를 이용하면 새로운 타입을 쉽게 추가할 수 있다.
- 상황에 따라 두 접근법을 적절히 조합하는 것이 중요하다.

## 6. 핵심 요약

| 접근 방식                          | 장점                | 단점                |
| ------------------------------ | ----------------- | ----------------- |
| **객체 (OOP)**                   | 새로운 동작(메서드) 추가 용이 | 새로운 데이터 타입 추가 어려움 |
| **자료구조 (Procedural)**          | 새로운 데이터 타입 추가 용이  | 새로운 동작 추가 어려움     |
| **DTO (Data Transfer Object)** | 데이터 전달에 최적화       | 비즈니스 로직을 포함하면 안 됨 |

> **상황에 따라 객체와 자료구조를 적절히 선택하는 것이 클린 코드의 핵심이다.**