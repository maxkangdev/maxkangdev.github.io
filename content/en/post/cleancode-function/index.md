---
categories:
  - dev|개발
date: 2025-02-04T10:32:53+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] Method"
---

## **1. Small Functions Are Better**
>A function should be as small as possible, ideally not exceeding 10 lines.  
Small functions are easier to read, understand, and maintain.

#### ✅ **Good Example (Small Function)**
```python
def get_user_full_name(user):
    return f"{user['first_name']} {user['last_name']}"

def print_user_info(user):
    full_name = get_user_full_name(user)
    print(f"User: {full_name}, Age: {user['age']}")
```
- The `get_user_full_name()` function performs only one task—combining the user's first and last name.
- The `print_user_info()` function only prints user information.
- Each function is small, clear, and focused on a single task.

#### ❌ **Bad Example (Large Function)**
```python
def print_user_info(user):
    full_name = f"{user['first_name']} {user['last_name']}"
    print(f"User: {full_name}, Age: {user['age']}")
```
- The logic for combining the name and printing is mixed.
- The function performs multiple tasks, making maintenance difficult.

---

## **2. Do One Thing**
> A function should do only one thing.  
> This rule ensures that a function does not perform multiple tasks, improving readability and maintainability.  
> Instead of handling multiple things, focus on a single responsibility.

#### ✅ **Good Example (Single Responsibility)**
```python
def calculate_area(radius):
    return 3.14 * radius * radius

def print_area(radius):
    area = calculate_area(radius)
    print(f"The area is {area}")
```
- `calculate_area()` is responsible only for calculating the area of a circle.
- `print_area()` is responsible only for printing the area.
- Each function focuses on one task, making the code clear and simple.

#### ❌ **Bad Example (Multiple Responsibilities)**
```python
def process_and_print_area(radius):
    area = 3.14 * radius * radius
    print(f"The area is {area}")
    # Additional tasks can be added (e.g., logging, saving data)
```
- `process_and_print_area()` calculates the area and also prints it.
- Mixing multiple tasks in one function makes it harder to understand and maintain.

---

## **3. Minimize Function Arguments**
> Functions should have as few parameters as possible.  
> Functions with too many parameters become complex and difficult to use.  
> Using objects or structures can help reduce the number of arguments.

#### ✅ **Good Example (Fewer Arguments)**
```python
def calculate_total_price(price, quantity):
    return price * quantity

def print_receipt(price, quantity):
    total_price = calculate_total_price(price, quantity)
    print(f"Total Price: {total_price}")
```
- `calculate_total_price()` takes only two arguments (price, quantity), making its role clear and simple.
- `print_receipt()` also takes only price and quantity.
- The lower number of arguments makes functions easier to understand.

#### ❌ **Bad Example (Too Many Arguments)**
```python
def process_order(price, quantity, customer_name, customer_address, discount, tax_rate):
    total_price = price * quantity
    total_price_after_discount = total_price - discount
    total_price_with_tax = total_price_after_discount * (1 + tax_rate)
    print(f"Customer: {customer_name}, Address: {customer_address}, Total: {total_price_with_tax}")
```
- `process_order()` takes six arguments and handles multiple tasks.
- Too many parameters increase complexity and the chance of errors.
- The function's role is unclear, and modifications impact a wide range of code.

---

## **4. Avoid Side Effects**
> Side effects occur when a function modifies external state.  
> Functions should rely only on their input and avoid modifying external data or states.  
> Avoiding side effects makes functions more predictable and easier to maintain.

#### ✅ **Good Example (No Side Effects)**
```python
def calculate_area(radius):
    return 3.14 * radius * radius

def print_area(radius):
    area = calculate_area(radius)
    print(f"The area is {area}")
```
- `calculate_area()` depends only on its input and does not change external state.
- `print_area()` prints the result without modifying any data.
- These functions operate independently and predictably.

#### ❌ **Bad Example (With Side Effects)**
```python
def calculate_area_and_update_log(radius):
    area = 3.14 * radius * radius
    with open("log.txt", "a") as log_file:
        log_file.write(f"Calculated area: {area}\n")
    return area
```
- `calculate_area_and_update_log()` calculates the area but also writes to a file.
- Changing external state (log file) makes the function less predictable and harder to test.
- Eliminating side effects results in a clearer and more independent function.

---

## **5. Separate Commands and Queries**
> Commands modify state, while queries return data without changing state.  
> Separating commands and queries makes functions more intuitive and maintainable.

#### ✅ **Good Example (Separated Command and Query)**
```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, item):
        self.items.append(item)

    def get_item_count(self):
        return len(self.items)
```
- `add_item()` is a command that modifies the state by adding an item.
- `get_item_count()` is a query that returns the number of items without modifying the state.
- Separating these functions makes their roles clear.

#### ❌ **Bad Example (Mixed Command and Query)**
```python
class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item_and_get_count(self, item):
        self.items.append(item)
        return len(self.items)
```
- `add_item_and_get_count()` both modifies the state and retrieves data.
- Mixing commands and queries makes the function unclear and harder to test.

---

## **6. Use Exceptions Instead of Error Codes**
> Instead of returning error codes, use exceptions to handle errors.  
> Exceptions make it easier to track errors and keep the code flow natural.

#### ✅ **Good Example (Using Exceptions)**
```python
class InsufficientFundsError(Exception):
    pass

def withdraw(amount, balance):
    if amount > balance:
        raise InsufficientFundsError("Insufficient funds.")
    return balance - amount
```
- `withdraw()` raises an exception when the balance is insufficient.
- Using exceptions makes errors explicit and ensures proper handling.

#### ❌ **Bad Example (Using Error Codes)**
```python
def withdraw(amount, balance):
    if amount > balance:
        return -1  # Error code
    return balance - amount
```
- `withdraw()` returns an error code instead of raising an exception.
- The caller must check and handle the error manually, leading to complex and unclear logic.

---

## **7. Handle Exceptions in One Place**
> **Exception handling should be separate from core logic to maintain code clarity.**

#### ✅ **Good Example**
```java
public void processOrder(Order order) {
    try {
        handleOrder(order);
    } catch (Exception e) {
        logError(e);
    }
}

private void handleOrder(Order order) {
    // Order processing logic
}

private void logError(Exception e) {
    System.out.println("Error occurred: " + e.getMessage());
}
```
- **Exception handling is in a separate function**, keeping the main logic clean.

#### ❌ **Bad Example**
```java
public void processOrder(Order order) {
    try {
        // Order processing
    } catch (Exception e) {
        System.out.println("Error occurred: " + e.getMessage());
    }
}
```
- **Mixing business logic and exception handling reduces readability**.

---

## **8. Avoid Duplication**
> Avoiding duplicate code is crucial. Repeated code makes modifications harder and increases the risk of errors.  
> Extract common logic into functions or classes to improve reusability.

#### ✅ **Good Example (Avoiding Duplication)**
```python
def calculate_discount(price, discount_rate):
    return price * (1 - discount_rate)

def calculate_final_price(price, discount_rate, tax_rate):
    discounted_price = calculate_discount(price, discount_rate)
    final_price = discounted_price * (1 + tax_rate)
    return final_price
```
- The discount calculation logic is extracted into `calculate_discount()`, making it reusable.
- `calculate_final_price()` avoids code repetition and remains concise.

#### ❌ **Bad Example (Duplicated Code)**
```python
def calculate_final_price(price, discount_rate, tax_rate):
    discounted_price = price * (1 - discount_rate)  # Duplicate logic
    final_price = discounted_price * (1 + tax_rate)
    return final_price
```
- The discount calculation is repeated, making maintenance difficult.

---

## **Questions to Ask When Writing Functions**
1. Is the function too large?
2. Is the function doing too many things?
3. Can I reduce the number of parameters?
4. Does the function cause unintended side effects?
5. Is this function a command or a query?
6. Am I using error codes instead of exceptions?
7. Is exception handling scattered throughout the code?
8. Are there any duplicated code blocks?

Keeping these in mind will lead to better code! 😃


## Reference
*Clean Code* by Robert C. Martin
