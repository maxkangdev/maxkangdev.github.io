+++
date = '2024-12-04T10:17:48+09:00'
draft = false
title = 'Rest, Restapi, Restfulapi, and their differences'
tags = ["rest"]
categories = ["dev|개발"]
+++

Since there aren’t many clear and concise explanations regarding the difference among them, I decided to organize it myself.  
I hope this post helps clear up any confusion 😆

First, it's important to understand what REST is.  
There are plenty of related articles out there, but for those who don't want to search, I’ve summarized it below.

## REST
- Stands for **Representational State Transfer**.
- REST is a set of architectural constraints, not a protocol or a standard.
> It's an architectural style that imposes conditions on how the API operates.
- The design principles of this architecture are as follows:
    - **Statelessness**
    - **Client-Server structure** 
    - **Cacheability**
    - **Layered System**
    - **Uniform Interface**

### Statelessness
- The server does not store the client’s state, so each request must contain all the necessary information independently.
- This improves scalability but places the responsibility on the client to transmit the necessary data.

> Example: When a user views a product on an online store and then requests more detailed information, the request must include all relevant info. The server won’t remember which product the user looked at.

### Client-Server Structure
- The client and server should be developed independently.
- The client communicates with the server using only the URI of the requested resource.
- The server simply delivers the requested data to the application via HTTP.

> Example: Frontend (client), Backend (server).

### Cacheability
- Resources should be cacheable by either the client or the server whenever possible.
- The server’s response must include information about whether caching is allowed for the delivered resource (in the `Cache-Control` header).

> Example: For news articles, which don’t change frequently, the server can provide a cacheable response. The frontend can then serve the cached response instead of sending a new request for the same article.

### Layered System
- The system should be designed so that neither the client nor the server knows how many intermediary layers (like proxies or load balancers) exist. This improves scalability.

> Example: Even if a user’s data request goes through proxies or load balancers before reaching the server, the user should be unaware of this.

### Uniform Interface
- All API requests for the same resource should look the same, regardless of where they come from.
- This includes unified URI structures, consistent HTTP methods, and standardized responses.

## REST vs REST API vs Restful API
(What you feel after reading a few blog posts)
- **REST**: An architectural style.
- **RESTful**: A term used to describe adhering to the REST architectural style.
> Like "peace" and "peaceful"... "harm" and "harmful"... you get the idea.
- **REST API** ~ **Restful API**: APIs that follow the REST architectural style.

# So, if they're the same, why use different terms and confuse everyone?
*(From this point on, these are my personal theories regarding the differences among rest, restapi, and restful api...🤪)*

When REST architecture emerged, so did the concept of a REST API, and it became widely used.  
But when you take a closer look at so-called REST APIs, things get a bit fuzzy.  
For instance, if session data is being passed during login, doesn’t that violate REST’s statelessness? Then it’s not really a REST API, is it?!

Enter a software guru to settle the debate...
> Is your so-called REST API actually **restful**?  
> 
> ![](/image/swing.png)  
> (You are not swinging at all...)  
> You're not doing REST at all... 

At this point, debates started over whether something is truly a REST API or not.  
Developers began using REST-related terminology incorrectly, which caused confusion, and I got confused too... which led me to organize it in this post...

## Conclusion
(Common folks😝): This is probably enough
- **REST**: An architectural style.
- **REST API** = **Restful API**: APIs that roughly follow the REST architectural style.

(Perfectionists🧐)
- **REST**: An architectural style.
- **REST API**: Should follow all of the REST principles, but since there are so many calling themselves REST APIs without fully adhering to it, we now consider APIs that roughly follow the principles to be REST APIs.
- **RESTful API**: A term used to refer to APIs that fully adhere to the REST principles, differentiating them from those that only partially follow them. This API **truly** follows REST.

> I'm always open to opinions or additional resources 🫠

---

*Reference*
- [https://aws.amazon.com/ko/what-is/restful-api/](https://aws.amazon.com/ko/what-is/restful-api/)
- [https://stackoverflow.com/questions/1568834/whats-the-difference-between-rest-restful](https://stackoverflow.com/questions/1568834/whats-the-difference-between-rest-restful)
- [https://softwareengineering.stackexchange.com/questions/277115/what-to-call-an-http-api-that-is-not-restful](https://softwareengineering.stackexchange.com/questions/277115/what-to-call-an-http-api-that-is-not-restful)
- [https://martinfowler.com/articles/richardsonMaturityModel.html](https://martinfowler.com/articles/richardsonMaturityModel.html)
