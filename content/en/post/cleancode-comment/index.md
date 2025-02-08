---
categories:
  - dev|개발
date: 2025-02-04T14:28:42+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] Comments"
---

## Is Commenting Really Necessary?

**No, it's not.**  

Most comments are used to compensate for poorly written code.  
> If you can’t write understandable code, you end up explaining it with lengthy comments.  

The older a comment gets, the more it drifts away from the code.  
> Do you update all related comments every time the code changes? Realistically, that's impossible.  
> Comments that contradict the code are far worse than having no comments at all.  

Truth exists in one place:  
> The code itself.  
> Instead of spending time writing comments, invest that time in writing better code.  
> Code should be clear enough that its intent is self-explanatory.  

However, avoiding comments entirely is not practical. Well-placed comments can be extremely useful.  
Let’s distinguish between good and bad comments.

## Good Comments  
Below are examples of comments that are not necessarily bad.  
**However, the best comment is no comment at all!**  

### Legal Comments  
> Comments that specify legal requirements, copyright information, or licensing details. These are typically placed at the top of a file.

**Example**
```java
// Copyright (C) 2023 by Robert C. Martin. All rights reserved.
// Released under the MIT License.
```

### Informative Comments
> Comments that provide additional information about a specific part of the code. For example, explaining the implementation details of an abstract method.

**Example**
```java
// This method sends an HTTP GET request and returns the response.
public HttpResponse sendGetRequest(String url) {
    // ...
}
```

### Comments Explaining Intent
> Comments that describe the developer’s intent or reasoning. Useful for explaining why a particular algorithm or business logic was chosen.

**Example**
```java
// Used binary search for performance optimization.
int index = Arrays.binarySearch(sortedArray, target);
```

### Comments Clarifying Meaning
> Comments that make the code’s meaning clearer, especially for complex logic or magic numbers.

**Example**
```java
// 86400 represents the number of seconds in a day.
int secondsInADay = 86400;
```

### Warning Comments
> Comments that warn about potential side effects or risks of executing certain code.

**Example**
```java
// This method closes the database connection. It must be reopened before reuse.
public void closeDatabaseConnection() {
    // ...
}
```

### TODO Comments
> Comments that mark tasks for future implementation or modification.

**Example**
```java
// TODO: Add exception handling.
public void processData() {
    // ...
}
```

### Emphasizing Important Code
> Comments that highlight the importance of certain code or indicate that it should only be modified with caution.

**Example**
```java
// This code significantly impacts system performance. Modify with caution.
public void optimizeSystemPerformance() {
    // ...
}
```

### Public API Javadocs
> Comments used for documenting public APIs. Written in Javadoc format to describe classes, methods, parameters, and return values.

**Example**
```java
/**
 * Returns the sum of two integers.
 * 
 * @param a First integer
 * @param b Second integer
 * @return Sum of the two integers
 */
public int add(int a, int b) {
    return a + b;
}
```

## Bad Comments
These comments harm code readability, provide unnecessary information, or create confusion.  
Most comments fall into this category, so avoid them whenever possible.

### Rambling Comments
> Comments filled with meaningless or redundant explanations that do not help in understanding the code.

**Example**
```java
// This method does something. Probably processes data. Not sure.
public void doSomething() {
    // ...
}
```

### Redundant Comments
> Comments that merely repeat what the code already states clearly.

**Example**
```java
// Add 1 to x.
x = x + 1;
```

### Misleading Comments
> Comments that do not match the actual behavior of the code, leading to misunderstandings.

**Example**
```java
// This method always returns true. (But actually, it can return false depending on the condition)
public boolean isAlwaysTrue() {
    return condition ? true : false;
}
```

### Mandatory Comments
> Comments added simply to follow a rule or convention, even when they provide no meaningful information.

**Example**
```java
// Default constructor
public MyClass() {
    // ...
}
```

### History Comments
> Comments used to track changes that should instead be managed by a version control system like Git.

**Example**
```java
// 2023-10-01: John Doe - Initial implementation
// 2023-10-05: Jane Smith - Bug fix
public void oldMethod() {
    // ...
}
```

### Useless Comments
> Comments that add no value or state the obvious.

**Example**
```java
// Start of loop
for (int i = 0; i < 10; i++) {
    // ...
}
```

### Noisy Comments
> Comments that clutter the code and reduce readability.

**Example**
```java
/////////////////////////////
// This part is important! //
/////////////////////////////
public void importantMethod() {
    // ...
}
```

### Comments That Could Be Replaced with Function or Variable Names
> Instead of comments, use descriptive function or variable names to convey intent.

**Example**
```java
// Check if x is greater than 0.
if (x > 0) {
    // ...
}

// Improved: Use a function name to express intent
if (isPositive(x)) {
    // ...
}
```

### Comments on Closing Brackets
> Comments placed on closing brackets, which are better handled by structuring code into smaller functions.

**Example**
```java
while (condition) {
    // ...
} // end while
```

### Author or Credit Comments
> Comments indicating who wrote or modified the code, which should be managed by a version control system.

**Example**
```java
// Author: John Doe
public void someMethod() {
    // ...
}
```

### Commented-Out Code
> Code that has been disabled using comments. This should be handled by a version control system.

**Example**
```java
// The following code may be needed later.
// oldMethod();
```

### HTML Comments
> Comments using HTML-like syntax, which can hurt readability.

**Example**
```java
/**
 * <h1>This is a heading</h1>
 * <p>This is a description.</p>
 */
public void myMethod() {
    // ...
}
```

### Global Information Comments
> Comments that provide general information unrelated to a specific block of code.

**Example**
```java
// This module manages all user information.
public void updateUserProfile() {
    // ...
}
```

### Ambiguous Relationship Comments
> Comments that have an unclear relationship to the code.

**Example**
```java
// Applies to all users.
public void applyDiscount() {
    // ... (discount logic)
}
```

### Function Header Comments
> Comments describing a function’s purpose when the function name and code already make it clear.

**Example**
```java
// This function adds two numbers.
public int add(int a, int b) {
    return a + b;
}
```

### Javadocs for Private Code
> Using Javadoc comments for private methods or classes, which results in unnecessary documentation.

**Example**
```java
/**
 * This method is used internally.
 */
private void internalMethod() {
    // ...
}
```

## Reference
*Clean Code* by Robert C. Martin






