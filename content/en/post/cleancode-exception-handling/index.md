---
categories:
  - dev|개발
date: 2025-02-05T09:45:41+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] Error Handling"
---


## 1. **Error Handling Should Not Reduce Code Readability**
Error handling is essential, but if used incorrectly, it can make the code complex and harder to read.  
Therefore, error handling should be designed in a way that maintains code clarity.

## 2. **Use Exceptions Instead of Error Codes**
Using error codes requires the calling code to handle them with if-else statements, making the code more complex.  
**By using exceptions, error-handling logic is separated, making the code cleaner.**

#### ❌ Bad Example (Returning Error Codes)
```java
public int saveData(Data data) {
    if (data == null) return -1;
    if (!data.isValid()) return -2;
    // Data saving logic
    return 0;
}

int result = saveData(data);
if (result == -1) {
    logger.log("Data is null");
} else if (result == -2) {
    logger.log("Data is invalid");
}
```

#### ✅ Good Example (Using Exceptions)
```java
public void saveData(Data data) {
    if (data == null) throw new NullPointerException("Data cannot be null");
    if (!data.isValid()) throw new InvalidDataException("Data is invalid");
    // Data saving logic
}

try {
    saveData(data);
} catch (InvalidDataException e) {
    logger.log(e.getMessage());
}
```
> **Using exceptions makes error-handling code more intuitive and cleaner.**

## 3. **Do Not Use Exceptions for Flow Control**
Exceptions should only be used for **exceptional situations** and should not be used for general control flow.

#### ❌ Bad Example (Using Exceptions for Normal Flow)
```java
try {
    int value = Integer.parseInt(input);  // Using exception for input validation
} catch (NumberFormatException e) {
    value = 0;  // Assigning default value
}
```

#### ✅ Good Example (Using Precondition Checks)
```java
if (input.matches("\\d+")) {  // Pre-check for numeric input
    int value = Integer.parseInt(input);
} else {
    int value = 0;
}
```
> **Exceptions should only be used for handling exceptional situations.**

## 4. **Throw Specific Exceptions (Avoid Catch-All)**
Catching all exceptions at once makes debugging difficult when unexpected errors occur.  
Instead, **avoid catch-all (`catch (Exception e)`) and define meaningful specific exceptions.**

#### ❌ Bad Example (Catching All Exceptions)
```java
try {
    process();
} catch (Exception e) {  // Catches all exceptions indiscriminately
    logger.log("Something went wrong: " + e.getMessage());
}
```

#### ✅ Good Example (Catching Specific Exceptions)
```java
try {
    process();
} catch (IOException e) {  
    logger.log("I/O error: " + e.getMessage());
} catch (DatabaseException e) {
    logger.log("Database error: " + e.getMessage());
}
```
> **Do not overuse catch-all; handle meaningful exceptions specifically.**

## 5. **Include As Much Information as Possible in Exceptions**
When throwing exceptions, **include sufficient information to make debugging easier.**
#### ❌ Bad Example (Vague Exception)
```java
throw new Exception("Something went wrong");
```

#### ✅ Good Example (Including Detailed Message)
```java
throw new FileNotFoundException("Configuration file 'config.xml' not found in /etc/app/");
```
> **Exception messages should be specific enough to quickly identify the issue.**

## 6. **Use Meaningful Exception Classes**
Instead of using generic exceptions like `Exception` or `RuntimeException`, **define and use meaningful exception classes.**
#### ❌ Bad Example (Using Generic Exception)
```java
throw new Exception("Invalid user input");
```

#### ✅ Good Example (Using a Custom Exception Class)
```java
public class InvalidUserInputException extends RuntimeException {
    public InvalidUserInputException(String message) {
        super(message);
    }
}
throw new InvalidUserInputException("User input must be a positive integer");
```
> **Using meaningful exception classes improves code clarity.**

## **Summary of Error Handling Principles**

✅ **Use exceptions instead of returning error codes.**  
✅ **Do not use exceptions for flow control; use them only for exceptional cases.**  
✅ **Avoid catch-all (`catch (Exception e)`) and define specific exceptions.**  
✅ **Write detailed exception messages to simplify debugging.**  
✅ **Design error handling to maintain code readability.**

> **Good error handling should not reduce code readability and should be separate from the logical flow.**

## Reference
*Clean Code* by Robert C. Martin

