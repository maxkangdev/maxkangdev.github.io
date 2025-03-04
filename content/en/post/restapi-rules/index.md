---
categories:
- dev|개발
date: "2024-12-09T21:03:13+09:00"
draft: false
tags:
- rest
title: Restapi Rules
---


I have written a post about the difference among `REST`, `RestAPI`, and `RestfulAPI` this post.  
[Rest, Restapi, Restfulapi, and their differences](/en/post/rest-restapi-restfulapi)

Now, let's figure out how to make RestAPI more restful. 🫠

## URLs
Make API URLs that follows the rules below.

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
>Even though rule#4 is discouraged, I do this alot...  
>Ex. `POST /api/request/1/cancel`  
>Sometimes it is just too much work to restructure the code to avoid this 🤪


## HTTP Status Codes
Use the correct HTTP status code in your API Responses.

Here are some codes that are used the most.

### `2XX` SUCCESS
- `200` [OK]
    - request has succeeded.
- `201` [Created]
    - request has succeeded and a new resource has been created as a result.
- `202` [Accepted]
    - request has been received but not completed yet.
    - It is typically used in long-running requests and batch processing.
- `204` [No Content]
    - request has succeeded but does not need to return a response body
    - different from returning `null` or `{}` along with `200`

### `4XX` Client Error
- `400` [Bad Request]
- `401` [Unauthorized]
- `403` [Forbidden]
- `404` [Not Found]
- `405` [Method Not Allowed]

### `5XX` Server Error
API Server should not throw `5XX` since it should have handled all the possible cases with `4XX` status codes to prevent any server error.

However, if outside service is malfunctioning, you can use it 🙂.



For more status codes and their full explanation, please refer to [https://developer.mozilla.org/en-US/docs/Web/HTTP/Status](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)