---
categories:
  - dev|개발
date: 2025-02-03T11:34:56+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] Meaningful Names"
---
## 1. Make Your Intent Clear
Names should instantly convey their purpose and function.
```python
# Bad Example
def get_p():  # 'p' is unclear
    return 3.14

# Good Example
def get_pi():  # Clearly returns the value of π
    return 3.14
```

## 2. Avoid Misleading Names
Names that don't reflect actual behavior can cause confusion.
```python
# Bad Example
def list_users():  # 'list' suggests it returns a list, but it doesn’t
    print("User1, User2, User3")

# Good Example
def print_users():  # Accurately describes what the function does
    print("User1, User2, User3")
```

## 3. Make Meaningful Distinctions
Avoid unnecessary variations—focus on clear differences.
```python
# Bad Example
class AccountData:
    pass

class AccountInfo:  # "Data" and "Info" don’t provide a clear distinction
    pass

# Good Example
class AccountDetails:  # More descriptive and meaningful
    pass
```

## 4. Use Pronounceable Names
Hard-to-pronounce names make discussions difficult.
```python
# Bad Example
class DtaRcrd:  # Abbreviated but awkward to say
    pass

# Good Example
class DataRecord:
    pass
```

## 5. Use Easily Searchable Names
Avoid overly short or vague names that make searching difficult.
```python
# Bad Example
days = [1, 7, 30]  # What do these numbers represent?

# Good Example
ONE_DAY = 1
ONE_WEEK = 7
ONE_MONTH = 30
days = [ONE_DAY, ONE_WEEK, ONE_MONTH]
```

## 6. Avoid Encoding in Names
Including data types in names creates redundancy and reduces readability.
```python
# Bad Example
strUserName = "John"  # The 'str' prefix is unnecessary

# Good Example
user_name = "John"
```

## 7. Use Meaningful Words
Choose words that precisely describe the function’s purpose.
```python
# Bad Example
def process_data():  # "process" is too vague
    pass

# Good Example
def calculate_salary():  # Clearly defines the function’s role
    pass
```

## 8. Differentiate Class and Function Names
Using the same name for a class and a method can be confusing.  
Also, class names should be nouns, while methods should be verbs.
```python
# Bad Example
class UserManager:
    def user_manager(self):  # Method name mirrors class name
        pass

# Good Example
class UserManager:
    def manage_users(self):  # Uses a verb to indicate an action
        pass
```

## 9. Use One Term Per Concept
Don’t mix different words for the same concept.
```python
# Bad Example
class UserFetcher:
    pass

class UserRetriever:  # Fetcher and Retriever mean the same thing—confusing
    pass

# Good Example
class UserFetcher:
    pass

class AdminFetcher:  # Consistently using 'Fetcher'
    pass
```

## 10. Avoid Wordplay
Using different terms for the same action can lead to misunderstandings.
```python
# Bad Example
def add_user(user):  # Does 'add' mean storing in DB or granting access?
    pass

def insert_user(user):  # Unclear if this refers to database insertion
    pass

# Good Example
def register_user(user):  # Clearly means user registration
    pass
```

## 11. Eliminate Unnecessary Context
If the class or module already provides context, avoid redundant prefixes.
```python
# Bad Example
class Car:
    def car_start_engine(self):  # 'car_' is redundant
        pass

# Good Example
class Car:
    def start_engine(self):
        pass
```

## The Most Important Rule
**Don’t be afraid to rename things.**  
If a better name makes the code clearer, other developers will appreciate it.

## Reference
Clean Code_ by Robert C. Martin