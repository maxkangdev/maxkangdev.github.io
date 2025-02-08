---
categories:
  - dev|개발
date: 2025-02-05T13:04:45+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] Classes"
---

## 1. **Classes Should Be Small**

- The smaller a class, the better.
- The key criterion for determining class size is the **"number of responsibilities."**
- **A class should have only one responsibility and only one reason to change.**
- It should adhere to the **Single Responsibility Principle (SRP).**

#### ❌ Bad Example (Class with Multiple Responsibilities)

```java
public class Employee {
    String name;
    String position;
    double salary;

    public void calculatePay() { /* Calculate salary */ }
    public void saveToDatabase() { /* Save to database */ }
    public void printReport() { /* Print report */ }
}
```

- The class is responsible for **salary calculation, database storage, and report printing, violating SRP.**

#### ✅ Good Example (Separation of Responsibilities)

```java
public class Employee {
    String name;
    String position;
    double salary;
}

public class Payroll {
    public void calculatePay(Employee employee) { /* Calculate salary */ }
}

public class EmployeeRepository {
    public void save(Employee employee) { /* Save to database */ }
}

public class ReportPrinter {
    public void print(Employee employee) { /* Print report */ }
}
```

- **Each class now has a single responsibility.**
- **This ensures maintainability since each class has only one reason to change.**

## 2. **Increase Cohesion and Reduce Coupling**

- **Cohesion**: A class has high cohesion if its methods and variables are closely related.
- **Coupling**: High coupling means a class is highly dependent on others, making changes more difficult.
- **A good design has high cohesion and low coupling.**

#### ❌ Bad Example (Low Cohesion, High Coupling)

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

- The `Order` class directly interacts with `Payment` and `Shipping`, leading to tight coupling.

#### ✅ Good Example (Reduce Coupling with Dependency Injection)

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

- **Dependency Injection (DI) reduces coupling.**
- The `Order` class only depends on `PaymentProcessor` and `ShippingService` interfaces without needing internal details.

## 3. **Design Classes to Be Flexible to Change**

- Always consider **potential changes** when designing a class.
- Follow the **Open-Closed Principle (OCP)**:
  - A class should be **open for extension but closed for modification**.

#### ❌ Bad Example (OCP Violation: Adding a New Payment Method Requires Code Modification)

```java
public class PaymentProcessor {
    public void processPayment(String paymentType) {
        if (paymentType.equals("CreditCard")) {
            // Credit card payment logic
        } else if (paymentType.equals("PayPal")) {
            // PayPal payment logic
        }
    }
}
```

- **Adding a new payment method requires modifying existing code, violating OCP.**

#### ✅ Good Example (OCP Compliance: Extend Without Modifying Existing Code)

```java
interface Payment {
    void pay();
}

class CreditCardPayment implements Payment {
    public void pay() { /* Credit card payment logic */ }
}

class PayPalPayment implements Payment {
    public void pay() { /* PayPal payment logic */ }
}

class PaymentProcessor {
    public void processPayment(Payment payment) {
        payment.pay();  // No modification needed when adding new payment methods
    }
}
```

- **New payment methods can be added without modifying existing code.**
- **This follows the Open-Closed Principle, ensuring flexibility to change.**

## 4. **Enhance Encapsulation**

- **Hide internal implementations (`public` usage should be minimized) and only expose necessary interfaces.**
- **Avoid excessive use of getters and setters to maintain encapsulation.**

#### ❌ Bad Example (Lack of Encapsulation)

```java
class BankAccount {
    public double balance;  // Direct access from outside
}

BankAccount account = new BankAccount();
account.balance = 1000;  // Allows unauthorized manipulation
```

#### ✅ Good Example (Proper Encapsulation)

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

- **`balance` is private, and manipulation is only allowed through methods.**
- **This ensures data integrity.**

## 5. **Clearly Define Class Relationships**

- **Use inheritance (`is-a` relationship) only when appropriate.**
- **Prefer composition (`has-a` relationship) over inheritance whenever possible.**
- **Avoid unnecessary inheritance.**

#### ❌ Bad Example (Incorrect Use of Inheritance)

```java
class Rectangle {
    int width, height;
}

class Square extends Rectangle {  // "is-a" relationship is unclear
    void setWidth(int width) {
        this.width = width;
        this.height = width;  // Conflicts with Rectangle's concept
    }
}
```

#### ✅ Good Example (Use Composition Instead)

```java
class Square {
    private int size;

    public void setSize(int size) {
        this.size = size;
    }
}
```

- **Removing unnecessary inheritance ensures a conceptually correct design.**
- **Favor composition over inheritance.**

---

## **Key Principles of Class Design**

✅ **Keep classes small (Each class should have a single responsibility - SRP).**  
✅ **Increase cohesion and reduce coupling.**  
✅ **Follow OCP (Open-Closed Principle) for flexibility to change.**  
✅ **Maintain encapsulation and avoid unnecessary getters/setters.**  
✅ **Favor composition over inheritance whenever possible.**

> **Good class design ensures maintainability, flexibility, and clear responsibilities.**

## Reference
*Clean Code* by Robert C. Martin

