---
categories:
- dev|개발
date: "2024-12-09T21:03:13+09:00"
draft: false
tags:
- rest
title: Restapi 규칙
---

최근 Rest, RestAPI, RestfulAPI의 차이점에 대해서 아래 글을 작성했었다.
[Rest, Restapi, Restfulapi 차이점](/ko/post/rest-restapi-restfulapi)

이제 RestAPI를 조금더 restful 하게 만드는 방법에 대해서 알아보자. 🫠

## URLs

1. Do not include `/` at the end.
```zsh
🚫 GET /api/users/  
✅ GET /api/users
```  

2. Use `-`(hyphen) instead of `_`(underbar).
```zsh
🚫 GET /api/user_commnets  
✅ GET /api/user-comments
```  

3. Use lowercase letters.
```zsh
🚫 GET /api/User-Comments   
✅ GET /api/user-comments
```

4. Do not include method in the url.
```zsh
🚫 GET /api/users/1/delete    
✅ DELETE /api/users/1
```
>4번 하지 말라 하긴하는데... 뭐... 돌아가기만 하면되지 .ㅎ.ㅎ.ㅎ
>Ex. `POST /api/request/1/cancel`  
>저거 안하고 하려면 시간 너무 걸림... 배보다 배꼽이 더져여 🤪


## HTTP Status Codes

API 답변에 정확한 HTTP Statue code를 쓰는것도 물론 중요함.
(대충 200 보내는 것보단, 생성됬으면 201 정도는 보내주는게 좋겠죠?)   

아래가 제일 많이 쓰는 것들. 나머지는 뭐 대충 필요할때 찾아서 쓰면됨니당. 

### `2XX` SUCCESS
- `200` [OK]
    - 요청 성공 
- `201` [Created]
    - 요청 성공 + 요청에 따라 새로운 자원이 생성됨. 
- `202` [Accepted]
    - 요청 받았음 (근데 아직 다 처리되지는 않음)
    - 보통 오래걸리는 요청이나 배치 요청에 쓰임. 
- `204` [No Content]
    - 요청 성공, 근데 response body는 딱히 필요없어서 안보냄 
    - 200과 함께 null 혹은 {} 을 보내는 것과는 다른 의미임. 

### `4XX` Client Error
- `400` [Bad Request]
- `401` [Unauthorized]
- `403` [Forbidden]
- `404` [Not Found]
- `405` [Method Not Allowed]

### `5XX` Server Error
API 서버는 가능한 모든 경우를 4XX 상태 코드로 처리하여 서버 오류가 발생하지 않도록 해야 합니다.
(5XX를 보내는 일은 없어야됨.)

그러나 외부 서비스가 오작동하는 경우에는 사용할 수 있습니다 🙂.

더 많은 상태 코드와 자세한 설명은 https://developer.mozilla.org/en-US/docs/Web/HTTP/Status 를 참고하세요.