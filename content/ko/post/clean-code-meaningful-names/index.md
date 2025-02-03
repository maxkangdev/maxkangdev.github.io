---
categories:
  - dev|개발
date: 2025-02-03T11:34:56+09:00
draft: false
tags:
  - cleancode
title: "[CleanCode] 의미있는 이름"
---
## 1. 의도를 분명히 밝혀라
이름만 보고도 역할과 목적을 쉽게 이해할 수 있도록 해야 한다.
```python
# 나쁜 예
def get_p():  # 'p'가 무엇을 의미하는지 알 수 없음
    return 3.14

# 좋은 예
def get_pi():  # π 값을 반환하는 함수임을 바로 알 수 있음
    return 3.14
```
## 2. 그릇된 정보를 피하라
실제 동작과 다른 이름을 사용하면 오해를 불러일으킬 수 있다.
```python
# 나쁜 예
def list_users():  # 'list'라는 단어 때문에 리스트를 반환할 것처럼 보임
    print("User1, User2, User3")

# 좋은 예
def print_users():  # 실제 동작(출력)에 맞는 이름 사용
    print("User1, User2, User3")
```
## 3. 의미 있게 구분하라
불필요한 차이를 두기보다는 명확한 차이를 만들어야 한다.
```python
# 나쁜 예
class AccountData:
    pass

class AccountInfo:  # Data와 Info의 차이가 불명확함
    pass

# 좋은 예
class AccountDetails:  # 더 구체적인 의미 제공
    pass
```
## 4. 발음하기 쉬운 이름을 사용하라
발음하기 어려운 이름은 코드 논의 시 의사소통을 방해한다.
```python
# 나쁜 예
class DtaRcrd:  # DataRecord를 줄였지만 발음하기 어려움
    pass

# 좋은 예
class DataRecord:
    pass
```
## 5. 검색하기 쉬운 이름을 사용하라
너무 짧거나 모호한 이름은 검색이 어렵기 때문에 피해야 한다.
```python
# 나쁜 예
days = [1, 7, 30]  # 1은 하루, 7은 일주일, 30은 한 달?

# 좋은 예
ONE_DAY = 1
ONE_WEEK = 7
ONE_MONTH = 30
days = [ONE_DAY, ONE_WEEK, ONE_MONTH]
```
## 6. 인코딩을 피하라
데이터 타입을 이름에 포함시키면 불필요한 중복이 생기고 가독성이 떨어진다.
```python
# 나쁜 예
strUserName = "John"  # 'str' 접두사는 불필요함

# 좋은 예
user_name = "John"
```
## 7. 자신만의 의미 있는 단어를 사용하라
모호한 단어 대신 명확한 단어를 사용해야 한다.
```python
# 나쁜 예
def process_data():  # 'process'가 너무 모호함
    pass

# 좋은 예
def calculate_salary():  # 함수의 역할이 더 명확함
    pass
```
## 8. 클래스 이름과 함수 이름은 다르게 하라
클래스와 메서드의 이름이 같으면 혼란을 초래할 수 있다.  
또한 클래스는 명사, 메소드는 동사가 적합하다. 
```python
# 나쁜 예
class UserManager:
    def user_manager(self):  # 클래스와 메서드 이름이 동일함
        pass

# 좋은 예
class UserManager:
    def manage_users(self):
        pass
```

## 9. 한 개념에 한 단어를 사용하라
비슷한 의미의 단어를 여러 개 사용하면 혼란을 줄 수 있다.
```python
# 나쁜 예
class UserFetcher:
    pass

class UserRetriever:  # Fetcher와 Retriever가 같은 의미로 쓰이면 헷갈림
    pass

# 좋은 예
class UserFetcher:
    pass

class AdminFetcher:  # Fetcher 하나만 사용하여 일관성 유지
    pass
```

## 10. 말장난을 피하라
같은 동작을 하는 함수에 다른 의미의 단어를 사용하면 오해를 유발할 수 있다.
```python
# 나쁜 예
def add_user(user):  # 'add'가 데이터 추가인지 권한 부여인지 모호함
    pass

def insert_user(user):  # DB에 삽입하는 것인지 불명확함
    pass

# 좋은 예
def register_user(user):  # 회원가입을 의미
    pass
```

## 11. 불필요한 맥락을 없애라
클래스나 모듈 이름에서 이미 맥락을 제공하고 있다면 중복된 표현은 제거해야 한다.
```python
# 나쁜 예
class Car:
    def car_start_engine(self):  # 'car_' 접두사는 불필요함
        pass

# 좋은 예
class Car:
    def start_engine(self):
        pass
```


## 가장 중요한 것 
또한 다른 개발자들이 반대할까봐 이름을 바꾸는 것을 **두려워 말아라**. 좋은 이름으로 바꿔주면 오히려 반갑고 고맙다. 


## Reference
클린코드 by 로버트 C. 마틴