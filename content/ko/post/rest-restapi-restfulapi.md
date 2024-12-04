+++
date = '2024-12-04T10:17:48+09:00'
draft = false
title = 'Rest, Restapi, Restfulapi 차이점'
tags = ["rest","network"]
categories = ["dev|개발"]
+++

세가지의 차이점에 대해서, 시원시원하게 의문을 풀어주는 글이 딱히 없어서 정리 해본다.   
요글이 의문점을 푸는데 도움이 되었으면 좋겠다😆

먼저 가장 중요한 REST가 뭔지 알아야된다.  
관련된 글이 많긴 하지만 찾기 귀찮은 사람들을 위해 아래 정리해두었다.

## REST
- Representational State Transfer의 약자
- REST is a set of architectural constraints, not a protocol or a standard.
>API 작동 방식에 대한 조건을 부과하는 아키텍쳐 스타일임
-  해당 아키텍쳐의 설계 원칙은 다음과 같음.
    - 무상태성(Stateless)
    - 클라이언트-서버 구조 (Client Server)
    - 캐시 가능성 (Cacheability)
    - 계층화(Layered System)
    - 균일한 인터페이스(Uniform Interface)

### 무상태성(Stateless)
- 서버는 클라이언트의 상태(state)을 저장하지 않으며, 모든 요청을 필요한 정보를 독립적으로 포함해야함.
- 확장성에는 좋지만, 클라이언트가 필요한 데이터를 전송할 책임을 갖음

>Ex. 사용자가 온라인 쇼핑몰에서 물건을 본뒤, 해당 물건에 대한 상세정보를 요청할때 그냥 정보만 요청하면 안됨. 서버는 사용자가 어떤 물건을 본지 기억하지 않음.

### 클라이언트-서버 구조 (Client Server)
- 클라이언트와 서버는 독립적으로 개발되어야함
- 클아이언트는 요청된 리소스의 URI만을 사용하여 서버와 통신.
- 서버는 HTTP로 요청받은 데이터를 애플리케이션에 전달만함.

>Ex. 프론트엔드(클라이언트), 백엔드(서버)

### 캐시 가능성 (Cacheability)
- 가능한 경우 클라이언트나 서버측에서 리소스를 캐시할수 있어야함.
- 서버응답에는  전달된 리소스에 대해 캐싱이 허용되는지 여부에 대한 정보도 포함되어야함(헤더에 `Cache-Control`)

> Ex. 뉴스같은 경우 특정 기사가 바뀌는 일은 자주 없으므로, 서버는 캐시 가능한 응답을 제공함. 프론트엔드에서는 동일기사가 조회 될때마다 서버에 요청을 보내는 대신, 캐시한 응답을 제공함.

### 계층화(Layered System)
- 클라이언트 혹은 서버는 몇개의 중간 계층을 걸치는지 알 수 없도록 설계되어야 함. -> 확장성

>Ex. 사용자가 데이터를 요청할때, 서버로 바로가는게 아니라 프록시 / 로드밸런서 등을 거쳐서 가는 경우라도 사용자는 그걸 모름.

### 균일한 인터페이스(Uniform Interface)
- 동일한 리소스에 대한 모든 API 요청으르 출처에 관계없이 동일하게 표시되어야함.
- 통일된 URI, HTTP 메서드 규칙, 표준화된 응답.


## REST vs REST API vs Restful API
(블로그 대충 몇개 읽으면 느끼는 차이점)
- `REST` 아키텍쳐 스타일
- `RESTful` REST 라는 아키텍쳐 스타일을 지키는 것을 restful 하다고 표현.
>peace, peaceful... harm, harmful ... 요런 맥락
- `REST API` ~ `Restful API` REST 아키텍쳐 스타일을 지키는 API

# 아니 그러면 둘이 똑같은데 왜 다른 단어씀? 괜히 헷갈리게?
*(여기서 부터는 삽질을 통해 내린 개인적인 뇌피셜이 반영된 결론입니다🤪)*

REST 아키텍쳐가 나타나고, REST API라는 개념이 생기면서 널리 사용됨.  
근데 까고 보니 REST API라고 개발된 것들 보니까 조금 애매한데?   
로그인할때 쓴 세션정보를 넘겨주고 있으면 REST의 무상태성이 안지켜진거아니야? 그럼 REST API가 아닌거자나?!

이쯤에서 나타나 한마디 하는 software guru....
> Is your so called RestAPI restful ?!  
> ...당신은 지금 전혀 REST를 하고 있지않아...  
> ![](/image/swing.png)

*깨알 영어 상식*  
`-ful`  full of   
*즉 restful 하다는 것은 REST의 모든 조건을 fully 만족시키고 있냐 라는 뜻*

이때 부터 이게 진짜 REST API 인가 아니냐로 치고박고 싸우고,  
개발자들이 REST와 관련 Terminology에 대해서 정확히 이해하지 않고 마구잡이로 써대면서 혼동이오고,  
나도 혼동이 와서 뇌피셜로 정리하는 단계까지 옴.

## 결론
(일반인😝) <- 이정도만 알아도 삶에 지장 없음
- `REST` 아키텍쳐 스타일
- `REST API` = `Restful API` REST 아키텍쳐 스타일을 어느정도 대충은 지키는 API

(깐깐징어🧐)
- `REST`  아키텍쳐 스타일
- `REST API` REST 아키텍쳐 스타일을 다 지켜야 하지만, 안지키면서 REST API라고 말하는 놈들이 너무 많아서 대충 어느정도 지키면 그렇다 하고 넘어가는 API
- `RESTful API` 대충 지키는 녀석들로 부터 찐으로 제대로 지키는 REST API들을 따로 지칭하기 위해 사용되는 단어. 이 API는 찐으로 REST를 지킨다는 의미로 주로 사용됨.



>관련 의견이나 자료는 항상 WELCOME 입니다 🫠

---
*Reference*
- [https://aws.amazon.com/ko/what-is/restful-api/](https://aws.amazon.com/ko/what-is/restful-api/)
- [https://stackoverflow.com/questions/1568834/whats-the-difference-between-rest-restful](https://stackoverflow.com/questions/1568834/whats-the-difference-between-rest-restful)
- [https://softwareengineering.stackexchange.com/questions/277115/what-to-call-an-http-api-that-is-not-restful](https://softwareengineering.stackexchange.com/questions/277115/what-to-call-an-http-api-that-is-not-restful)
- [https://martinfowler.com/articles/richardsonMaturityModel.html](https://martinfowler.com/articles/richardsonMaturityModel.html)