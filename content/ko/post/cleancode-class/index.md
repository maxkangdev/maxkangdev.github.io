---
categories:
  - dev|개발
date: 2025-02-05T13:04:45+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] 클래스"
---

## 1. **클래스는 작아야 한다**

- 클래스는 작을수록 좋다.
- 클래스의 크기를 결정하는 기준은 **"책임(Responsibility)의 수"** 이다.
- **클래스는 단 하나의 책임만 가져야 하며, 변경 이유가 하나여야 한다.**
- SRP(Single Responsibility Principle, 단일 책임 원칙)를 준수해야 한다.

#### ❌ 나쁜 예제 (여러 책임을 가진 클래스)

```java
public class Employee {
    String name;
    String position;
    double salary;

    public void calculatePay() { /* 급여 계산 */ }
    public void saveToDatabase() { /* 데이터베이스 저장 */ }
    public void printReport() { /* 보고서 출력 */ }
}
```

- 급여 계산, 데이터 저장, 보고서 출력 등 **여러 책임을 한 클래스가 수행**하고 있다.

#### ✅ 좋은 예제 (책임을 분리)

```java
public class Employee {
    String name;
    String position;
    double salary;
}

public class Payroll {
    public void calculatePay(Employee employee) { /* 급여 계산 */ }
}

public class EmployeeRepository {
    public void save(Employee employee) { /* 데이터베이스 저장 */ }
}

public class ReportPrinter {
    public void print(Employee employee) { /* 보고서 출력 */ }
}
```

- **각 클래스가 하나의 책임만 가지도록 분리**했다.
- **변경의 이유가 하나뿐이므로 유지보수가 쉬워진다.**

## 2. **응집도를 높이고, 결합도를 낮춰라**

- **응집도(Cohesion)**: 클래스 내 메서드와 변수가 서로 밀접하게 관련될수록 응집도가 높다.
- **결합도(Coupling)**: 클래스 간 의존성이 많을수록 결합도가 높아지고, 변경 시 영향이 커진다.
- **좋은 설계는 응집도가 높고, 결합도가 낮다.**

#### ❌ 나쁜 예제 (응집도가 낮고 결합도가 높음)

```java
public class Order {
    private Payment payment;
    private Shipping shipping;
    
    public void process() {
        payment.charge();
        shipping.ship();
    }
}
```

- `Order` 클래스가 `Payment`와 `Shipping`을 직접 호출하고 있어 결합도가 높다.

#### ✅ 좋은 예제 (의존성 주입으로 결합도 낮추기)

```java
public class Order {
    private PaymentProcessor paymentProcessor;
    private ShippingService shippingService;

    public Order(PaymentProcessor paymentProcessor, ShippingService shippingService) {
        this.paymentProcessor = paymentProcessor;
        this.shippingService = shippingService;
    }

    public void process() {
        paymentProcessor.processPayment();
        shippingService.shipOrder();
    }
}
```

- **의존성 주입(DI, Dependency Injection)을 사용하여 결합도를 낮춤.**
- `Order` 클래스는 `PaymentProcessor`와 `ShippingService`에만 의존하고, 내부 구현을 알 필요가 없음.

## 3. **변경에 유연한 클래스를 설계하라**

- 클래스를 설계할 때는 **변경 가능성을 고려해야 한다.**
- **OCP (Open-Closed Principle, 개방-폐쇄 원칙)**을 따르도록 설계하라.
    - 기존 코드를 수정하지 않고 기능을 확장할 수 있어야 한다.

#### ❌ 나쁜 예제 (OCP 위반, 새로운 결제 수단 추가 시 기존 코드 변경 필요)

```java
public class PaymentProcessor {
    public void processPayment(String paymentType) {
        if (paymentType.equals("CreditCard")) {
            // 신용카드 결제 로직
        } else if (paymentType.equals("PayPal")) {
            // PayPal 결제 로직
        }
    }
}
```

- 새로운 결제 수단을 추가하려면 `processPayment` 메서드를 수정해야 한다.

#### ✅ 좋은 예제 (OCP 준수, 새로운 결제 수단 추가 시 기존 코드 변경 불필요)

```java
interface Payment {
    void pay();
}

class CreditCardPayment implements Payment {
    public void pay() { /* 신용카드 결제 로직 */ }
}

class PayPalPayment implements Payment {
    public void pay() { /* PayPal 결제 로직 */ }
}

class PaymentProcessor {
    public void processPayment(Payment payment) {
        payment.pay();  // 새로운 결제 방식이 추가되어도 기존 코드 수정 불필요
    }
}
```

- **새로운 결제 방식 추가 시 기존 코드를 수정하지 않아도 된다.**
- **OCP(개방-폐쇄 원칙)를 따르는 설계로 변경에 유연함.**

## 4. **캡슐화를 강화하라**

- **클래스 내부 구현을 숨기고(public 최소화), 필요한 인터페이스만 외부에 제공하라.**
- **Getter, Setter를 남용하지 말고, 캡슐화를 유지하라.**

#### ❌ 나쁜 예제 (캡슐화 부족)

```java
class BankAccount {
    public double balance;  // 외부에서 직접 접근 가능
}

BankAccount account = new BankAccount();
account.balance = 1000;  // 잘못된 조작 가능
```

#### ✅ 좋은 예제 (캡슐화 적용)

```java
class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}
```

- **`balance`를 `private`으로 숨기고, 메서드를 통해 조작하도록 함.**
- **데이터 무결성을 유지할 수 있음.**

## 5. **클래스 간 관계를 명확하게 하라**

- **"is-a" 관계면 상속을, "has-a" 관계면 포함(Composition)을 사용하라.**
- **불필요한 상속을 피하고, 조합(Composition)을 우선적으로 고려하라.**

#### ❌ 나쁜 예제 (잘못된 상속 사용)

```java
class Rectangle {
    int width, height;
}

class Square extends Rectangle {  // "is-a" 관계가 불명확
    void setWidth(int width) {
        this.width = width;
        this.height = width;  // 정사각형은 가로/세로가 같아야 하지만, 부모 클래스의 개념과 충돌
    }
}
```

#### ✅ 좋은 예제 (조합 사용)

```java
class Square {
    private int size;

    public void setSize(int size) {
        this.size = size;
    }
}
```

- **불필요한 상속을 제거하고, 개념적으로 올바른 설계를 유지.**
- **상속보다 조합(Composition)을 우선적으로 고려하라.**

---

##  **클래스 설계의 핵심 원칙**

✅ **클래스는 작아야 한다. (하나의 책임만 가져야 함 - SRP)**  
✅ **응집도를 높이고, 결합도를 낮춰라.**  
✅ **변경에 유연한 구조 (OCP - 개방-폐쇄 원칙)를 고려하라.**  
✅ **캡슐화를 유지하고, 불필요한 getter/setter를 피하라.**  
✅ **상속보다는 조합(Composition)을 우선적으로 고려하라.**

> **좋은 클래스 설계는 유지보수성이 높고, 변경에 유연하며, 명확한 책임을 가진다.**