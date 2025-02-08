---
categories:
  - dev|개발
date: 2025-02-05T09:19:54+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] Object and Data Structure"
---

## 1. Difference Between Objects and Data Structures

- **Object**
    - Encapsulates both data (fields) and behavior (methods).
    - Hides internal data and exposes only behavior (methods) externally.
    - _"Hide the data and expose the behavior."_
- **Data Structure**
    - Contains only data and has no separate behavior (methods).
    - Exposes data, while the logic to handle it is managed by external code.
    - _"Expose the data and hide the behavior."_

## 2. Procedural Programming vs Object-Oriented Programming

- **Procedural Programming**
    - Exposes data structures and designs functions to manipulate the data.
    - Easy to add new functions (behavior) but difficult to add new data types.
- **Object-Oriented Programming (OOP)**
    - Hides data and allows access only through object methods.
    - Easy to add new data types but difficult to add new behavior (methods).

> **In short, objects make it easy to add behavior, whereas data structures make it difficult to add new data types.**  
> → **Choose the appropriate approach depending on the situation.**

## 3. Law of Demeter

- **"Train Wreck" Problem**
    - Exposing an object's internal structure makes client code dependent on too many details.
    - Long chain calls like `obj.getA().getB().getC().doSomething()` reduce maintainability.

#### ❌ Bad Example (Violation of the Law of Demeter)

```java
class Person {
    Address address;
    Address getAddress() { return address; }
}

class Address {
    String city;
    String getCity() { return city; }
}

// Client code
Person person = new Person();
String city = person.getAddress().getCity();  // Exposes internal structure
```

#### ✅ Good Example (Encapsulation Applied)

```java
class Person {
    Address address;
    
    String getCity() {  // Hides internal structure and provides a method
        return address.getCity();
    }
}

// Client code
String city = person.getCity();  // No need to know internal structure
```

> **Maintaining encapsulation ensures that internal changes do not affect client code.**

## 4. Do Not Wrap Data Structures Like Objects

- The purpose of data structures is to expose data, so **do not attempt to add behavior (methods) as if they were objects.**
- Data structures should serve purely as containers, without additional logic.

#### ❌ Bad Example (Unnecessary Behavior in a Data Structure)

```java
class Point {
    private double x, y;
    
    double calculateDistance(Point other) {  // Unnecessary behavior in a data structure
        return Math.sqrt(Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2));
    }
}
```

#### ✅ Good Example (Keep Data Structures Simple and Separate Behavior)

```java
class Point {
    double x, y;  // Expose data
}

class Geometry {
    static double calculateDistance(Point p1, Point p2) {  // Handle behavior separately
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }
}
```

> **A clean design keeps data structures simple and handles behavior in separate service or utility classes.**

## 5. Balancing Objects and Data Structures

- **Parts expected to change frequently** should be encapsulated using **object-oriented design**.
- **Parts with low likelihood of change** should be designed using **data structures** to maintain simplicity.
- Using data structures allows for easy addition of new behavior, while using objects makes it easier to add new types.
- It's crucial to balance both approaches depending on the context.

## 6. Key Takeaways

| Approach                           | Advantages                     | Disadvantages                  |
| ---------------------------------- | ------------------------------ | ------------------------------ |
| **Objects (OOP)**                  | Easy to add new behavior (methods) | Difficult to add new data types |
| **Data Structures (Procedural)**    | Easy to add new data types      | Difficult to add new behavior  |
| **DTO (Data Transfer Object)**      | Optimized for data transfer     | Should not contain business logic |

> **Choosing between objects and data structures appropriately is key to writing clean code.**

## Reference
*Clean Code* by Robert C. Martin