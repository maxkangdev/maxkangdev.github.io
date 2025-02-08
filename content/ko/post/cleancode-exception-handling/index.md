---
categories:
  - dev|개발
date: 2025-02-05T09:45:41+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] 오류 처리"
---
## 1. **오류 처리는 프로그램의 가독성을 해치지 않아야 한다**
오류 처리는 필수적이지만, 잘못된 방식으로 사용하면 코드가 복잡해지고 가독성이 저하될 수 있다.  
따라서, 오류 처리는 코드의 명확성을 유지하는 방향으로 설계해야 한다.

## 2. **오류 코드보다 예외를 사용하라**
오류 코드를 사용하면, 호출하는 쪽에서 if-else를 사용하여 처리해야 하므로 코드가 복잡해진다.  
**예외를 사용하면 오류 처리 로직이 분리되어 코드가 더 깔끔해진다.**

#### ❌ 나쁜 예제 (오류 코드 반환)
```java
public int saveData(Data data) {
    if (data == null) return -1;
    if (!data.isValid()) return -2;
    // 데이터 저장 로직
    return 0;
}

int result = saveData(data);
if (result == -1) {
    logger.log("Data is null");
} else if (result == -2) {
    logger.log("Data is invalid");
}
```

#### ✅ 좋은 예제 (예외 사용)
```java
public void saveData(Data data) {
    if (data == null) throw new NullPointerException("Data cannot be null");
    if (!data.isValid()) throw new InvalidDataException("Data is invalid");
    // 데이터 저장 로직
}

try {
    saveData(data);
} catch (InvalidDataException e) {
    logger.log(e.getMessage());
}
```
> **예외를 사용하면 오류 처리 코드가 더 직관적이고 깔끔해진다.**

## 3. **예외는 흐름 제어에 사용하지 말라**
예외는 **예외적인 상황**에서 사용해야 하며, 일반적인 흐름을 제어하는 용도로 사용하면 안 된다.

#### ❌ 나쁜 예제 (예외를 정상적인 흐름에 사용)
```java
try {
    int value = Integer.parseInt(input);  // 예외를 이용해 입력값 검사
} catch (NumberFormatException e) {
    value = 0;  // 기본값 할당
}
```

#### ✅ 좋은 예제 (사전 조건 검사 사용)
```java
if (input.matches("\\d+")) {  // 숫자인지 미리 검사
    int value = Integer.parseInt(input);
} else {
    int value = 0;
}
```
> **예외는 예외적인 상황을 다루는 용도로만 사용해야 한다.**

## 4. **특정 예외를 던져라 (catch-all 사용 금지)**
모든 예외를 한꺼번에 잡아 처리하면, 예상하지 못한 오류가 발생할 경우 디버깅이 어려워진다.  
따라서, **catch-all (`catch (Exception e)`)을 지양하고, 의미 있는 특정 예외를 정의하여 사용해야 한다.**

#### ❌ 나쁜 예제 (모든 예외를 catch)
```java
try {
    process();
} catch (Exception e) {  // 어떤 예외든 다 잡아버림
    logger.log("Something went wrong: " + e.getMessage());
}
```

#### ✅ 좋은 예제 (특정 예외를 catch)
```java
try {
    process();
} catch (IOException e) {  
    logger.log("I/O error: " + e.getMessage());
} catch (DatabaseException e) {
    logger.log("Database error: " + e.getMessage());
}
```
> **catch-all을 남용하지 말고, 의미 있는 예외를 구체적으로 다뤄야 한다.**

## 5. **예외 정보를 최대한 포함하라**
예외를 던질 때는 **충분한 정보를 포함하여 디버깅을 쉽게 만들어야 한다.**
#### ❌ 나쁜 예제 (추상적인 예외)
```java
throw new Exception("Something went wrong");
```

#### ✅ 좋은 예제 (의미 있는 메시지 포함)
```java
throw new FileNotFoundException("Configuration file 'config.xml' not found in /etc/app/");
```
> **예외 메시지는 문제를 빠르게 파악할 수 있도록 구체적이어야 한다.**

## 6. **예외를 던질 때는 의미 있는 클래스를 사용하라**
`Exception`이나 `RuntimeException` 같은 일반적인 예외 대신, **의미 있는 예외 클래스를 직접 만들어 사용하라.**
#### ❌ 나쁜 예제 (일반적인 예외 사용)
```java
throw new Exception("Invalid user input");
```

#### ✅ 좋은 예제 (의미 있는 예외 클래스 사용)
```java
public class InvalidUserInputException extends RuntimeException {
    public InvalidUserInputException(String message) {
        super(message);
    }
}
throw new InvalidUserInputException("User input must be a positive integer");
```
> **의미 있는 예외 클래스를 사용하면 코드의 명확성이 높아진다.**

##  **오류 처리 원칙 요약 **

✅ **예외를 사용하고, 오류 코드 반환을 피하라.**  
✅ **예외는 흐름 제어에 사용하지 말고, 예외적인 상황에만 사용하라.**  
✅ **catch-all (`catch (Exception e)`)을 남용하지 말고, 의미 있는 예외를 정의하라.**  
✅ **예외 메시지는 구체적으로 작성하여 디버깅을 쉽게 하라.**  
✅ **오류 처리는 코드의 가독성을 유지하면서 설계해야 한다.**

> **좋은 오류 처리는 코드 가독성을 해치지 않고, 논리 흐름과 분리되어야 한다.**