---
categories:
- devops
date: "2025-01-02T10:44:29+09:00"
draft: false
tags:
- kubernetes
title: '[Kubernetes] TLS Certificate란?'
---

TLS Certificate 이 뭔지 제대로 이해하려면, 아래 개념부터 알아야됨   
- 대칭 암호화
- 비대칭 암호화
- Hybrid 암호화

## 대칭 암호화
- `Steps`
  1. **키 생성**: 암/복호화를 위해 키 하나를 생성 
  2. **암호화**: 해당 키를 사용하여 데이터를 암호화
  3. **전송**: 암호화된 데이터를 상대방에게 전달 
  4. **복호화**: 상대방은 암호화된 데이터를 받음. 이후 키를 사용해서 해당 데이터를 복호화함.
- `특징`
  - **단일 키**: 암/복호화에 하나의 키가 사용됨. 
  - **개빠름**: 비대칭 암호화 보다 더 빠름. 따라서 큰 데이터에 적합하지 
  - **키하나에 보안이 달림**: 단일 키기 때문에 해당 키를 얼마나 잘 보호하냐에 따라서 보안이 좋을수도 나쁠수도 있음
  - **큰 데이터에 효율적임**: 파일 시스템이나 데이터베이스처럼, 대량의 데이터를 다루는 곳에서 자주 사용됨. 
- `Common Algorithms `
  - AES, DES, 3DES, Blowfish, RC4, etc ...

> **문제점**   
> 데이터를 받는 쪽에서 데이터를 보려면 키가 필요함. 그러면 키도 줘야겠지? 그럼 키가 어떠한 방식으로든 전송이 되야겠지(보통 네트워크)?  
> 그러면 이제 전송되는 과정에서 털릴 위험이 있음.  
> 그래서 나온게 바로 **비대칭 암호화** 😆

## 비대칭 암호화
- `Steps`
  1. **키 생성**: 두개의 키를 생성—a public key & a private key. public key는 다른사람들이랑 공유하고(뭐 인터넷에 올리던 뭘 하던), private key는 혼자만 들고 있음
  2. **암호화**: **상대방**의 public key를 사용해서 데이터를 암호화
  3. **전송**: 암호화된 데이터를 상대방에게 전달
  4. **복호화**: 상대방은 암호환된 데이터를 받음. 이후 **자신의 private key** 를 사용하더 해당 데이터를 복호화함. 
- `특징`
  - **두개의 키(Public & Private)**: 암호화는 public key로, 복호화는 private key로 진행
  - **키 공유**: Private Key는 전달할 필요가 전혀 없음. Public key만 공유하면됨. 이러면 안전하게 키를 공유할 수 있음. 
  - **비교적 느림**: 이게 가능한 이유는 복잡한 수학 연산을 통해 private & public key가 생성되기 때문임. 그렇기 때문에 그만큼 느림...
  - **높은 안정성**: public key로 부터 private key를 알아내기가 사실상 불가능함 (대략 백만년 걸린데...🤣). 그래서 매우 안전함 
- `Common Algorithms `
    - RSA, ECC, DSA, Diffie-Hellman, etc ...


### 실사용 예제 (SSH)

다들 잘 쓰는 SSH가 이거의 예제중 하나임

**1. 키 생성**
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# -t rsa: Specifies the RSA algorithm.
# -b 4096: Specifies the key length (4096 bits for stronger security).
# -C "your_email@example.com": Adds a comment, typically your email, for identification.

# Generated Files
# Private key: ~/.ssh/id_rsa
# Public key: ~/.ssh/id_rsa.pub
```

**2. 상대 서버에 키 복제** 
```bash
ssh-copy-id username@remote_server_ip
# 이러면 public key (id_rsa.pub) 가 상대 서버의 ~/.ssh/authorized_keys 파일에 등록됨
# 그러면 이제 본인 서버에 있는 private key로 인증가능 

# 아니면 아래처럼 매뉴얼하게 직접 갔다가 써도되고 
cat ~/.ssh/id_rsa.pub
echo "your_public_key_content" >> ~/.ssh/authorized_keys
```
*물론 처음으로 해당 서버에 접근할때는 password 가 필요합니당 

**3. SSH 연결 (Client Side):**
```bash
ssh username@remote_server_ip
```

## Hybrid 암호화 (최고의 조합)

- `Steps`
  1. **키 생성**
     - 송신자가 먼저 **대칭 암호화**에 쓰일 대칭 키를 생성 이후 데이터를 해당 대칭 키로 암호화
     - 수신자는 **비대칭 암호화**에 쓰일 public & private key를 생성
  2. **대칭키 암호화**
     - 송신자는 **대칭키**를 수신자의 public key를 사용하여 암호화함. 
  3. **데이터 및 대칭 키 송신**
     - 송신자는 암호화된 데이터와 암호화된 키를 수신자에게 전달 
  4. **대칭키 복호화**
     - 수신자는 자신의 private key를 사용하여 대칭키를 복호화
  5. **데이터 복호화**
     - 이후 수신자는 복호화된 대칭키를 사용하여 데이터를 복호화 
- `특징`
  - **하이브리드**: 비대칭 암호화를 사용하여 대칭키를 수신과정에서 안전하게 보호함. 대칭키를 사용해서 실질적인 데이터 암/복호화가 이루어지기 때문에 빠름.
  - **안전 및 속도**: 그렇기에 비대칭 암호화의 안전성과 대칭 암호화의 속도를 둘다 가져갈 수 있음. 개좋은데? 😤 
  - **보통 많이 사용됨**: 그렇기 때문에 HTTPS 같이 속도와 안정성이 중요한 곳에 주로 사용됨. 
- `Algorithms`
  - 비대칭 암호화 & 대칭 암호화 알고리즘 둘다 사용  


> **근데 문제가 또있네..? 😡**
> 너가 만약 은행 웹사이트에 로그인을 하려고 한다고 가정해봐 
> 근데, 😈해커😈가 가짜 은행 웹사이트를 만들어가지고 너가 찐 은행 웹사이트가 아니라 가짜 웹사이트로 들어가게 만들어놨어. ㄹㅇ 개똑같아서 눈치못챔.  
> 이렇게되면 너는 **가짜 은행 웹사이트의 public key** 로 너의 아이디와 비밀번호를 암호화해서 가짜 은행 웹사이트로 해당 정보를 보내겠지? 
> 그러면 해커는 실실 웃으면서 자기 private key를 사용해서 비밀번호를 볼 수 있겠지? ☠️


## Certificate (TLS/SSL)

만약 public key가 ㄹㅇ 찐인지 아니면 해커가 만들어낸 짜가인지 구별할 수 있는 방법이 있다면?!!  
-> **Certificate 등장(두둥...) 😤**

그래서 public key 대신에 certificate를 수신자에게 전달함. 

아래는 `openssl`로 만들어낸 certificate 임 (복잡하니 이렇게 생겼구나하고 넘어가...)
```yaml
Certificate:
    Data:
        Version: 3 (0x2)  # X.509 version 3, the most commonly used version
        Serial Number:
            03:37:21:ad:54:9d:8f:34:dd:34:22:9d:cc:48:c1:f5  # Unique identifier for the certificate
        Signature Algorithm: sha256WithRSAEncryption  # The algorithm used to sign the certificate
        Issuer: C = US, O = Let's Encrypt, CN = Let's Encrypt Authority X3  # The Certificate Authority that issued the certificate
        Validity:
            Not Before: Dec 29 12:00:00 2023 GMT  # The start date of certificate validity
            Not After : Mar 29 12:00:00 2024 GMT  # The end date of certificate validity
        Subject: CN = www.example.com  # The domain name that the certificate is issued for
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption  # The public key algorithm used (RSA)
            Public-Key: (2048 bit)  # The size of the public key (2048 bits)
            Modulus:  # The modulus of the RSA public key
                00:ad:23:89:5e:23:ab:5d:c0:4f:82:bb:17:55:6f:
                45:cd:1e:69:62:4f:63:ef:45:6c:c5:14:19:a5:a7:  # The modulus in hexadecimal format
            Exponent: 65537 (0x10001)  # The exponent of the RSA public key
        X509v3 extensions:  # Extensions to the certificate
            X509v3 Subject Alternative Name:  # List of additional domain names covered by the certificate
                DNS:www.example.com, DNS:example.com
            X509v3 Basic Constraints:  # Specifies if the certificate can be used as a CA certificate
                CA:FALSE
            X509v3 Key Usage:  # Specifies the allowed usages for the public key (e.g., signing, encryption)
                Digital Signature, Key Encipherment
            X509v3 Extended Key Usage:  # Specifies the allowed usages for the certificate
                TLS Web Server Authentication, TLS Web Client Authentication
    Signature Algorithm: sha256WithRSAEncryption  # The algorithm used to sign the certificate
         61:2c:28:67:1b:ea:11:c2:ba:17:dc:29:ff:75:72:23:1c:7e:43:  # The signature in hexadecimal format
         d1:96:3f:5a:9b:44:57:1b:3d:a6:fc:85:52:6a:c5:b2:60:fa:4e:
```

**근데 아무나(해커도) Certificate 걍 만들수 있는거 아님? Public key랑 뭐가 다른데...**  

ㅇㅇ 맞음. Certificate은 만들고 사인해야되는데 그냥 😈개인😈도 할수 있어서 개인이 한건 안전하지않음.  
그렇기 때문에, 인증된 기관(a.k.a Certificate Authority or CA) 에서 사인한것들만이 안전하다고 볼수 있음. Symantec 이나 Digicert같은 놈들이 있음  

그리고 발급 과정은 다음과 같음 

- `Steps` _일단 알아둬야할건 CA들은 각자 자기들만의 고유 private key 와 public key를 가지고 있음. OK?_
  1. 서버에서 private key 와 public key를 생성함.
  2. 이후 CSR(Certificate Signing Request)을 생성함. CSR은 대략 다음 정보를 포함하고 있음
     - 도메인 이름 (CN, Common Name): 인증서를 적용할 도메인.
     - 조직 정보: 회사 이름, 위치 등.
     - Public Key
  3. CA에게 CSR를 보냄. 여기 서류있으니까 Certificate 만들어줘! 하는거임
  4. CA는 CSR에 포함된 도메인 소유권을 아래 방법등을 통해 검증함.
     - DNS 검증: 특정 TXT 레코드를 도메인의 DNS에 추가.
     - HTTP 검증: CA에서 제공한 파일을 특정 URL 경로에 업로드.
     - 이메일 검증: 도메인 관리자 이메일로 검증 링크를 전송
  5. 검증이 완료되면 인증서를 발급해줌 (보통 `.crt` 나 `.cer` 형태)
  6. 이후 서버에서 발급된 인증서를 사용해서 요리조리 설정함.
  7. 이후 사용자가 해당 서버에 데이터를 보내려할때 요렇게 발급받은 Certificate를 받는거임!

#### 🤓**흠.. 뭐 어떻게 발급받는지는 알겠어. 근데 브라우저가 어케 Semantic같은 놈들이 찐 안전한 CA인지 어떻게 앎?** 🤓  
#### ☠️**또 안전하다고 해도 개네가 찐으로 사인한건지 어케암? 위조 ㅆㄱㄴ아님?**  ☠️

이건 또 요렇게 해결함

1. 서버로부터 인증서 수신. 인증서에는 다음 정보들이 포함되어 있음 
   - 서버의 공개 키
   - 서버의 도메인 이름 
   - 인증서를 발급한 CA의 정보 
   - 유효 기간 (발급일 및 만료일)
   - 서버 소유자의 디지털 서명 (CA의 개인 키로 서명됨)
2. 인증서 체인 확인
   - 인증서 체인은 아래 단계로 구성되어 있음
     - **서버 인증서**: 서버에서 직접 제공한 인증서.
     - **중간 인증서**: CA가 발급한 중간 인증기관의 인증서.
     - **루트 인증서**: 신뢰할 수 있는 최상위 CA의 인증서.
   - 서버는 일반적으로 서버인증서랑 중간 인증서를 함께 제공함
   - 브라우저는 루트 인증서를 자체적으로 보관하고 있음 
3. 루트 인증서와의 매칭
   - 브라우저는 서버에서 받은 인증서를 시작으로 체인의 최상위에 있는 루트 인증서까지 다음을 확인함
     - **서명 검증**: 각 인증서가 상위 인증서의 공개 키로 디지털 서명을 확인.
       - 예: 서버 인증서 → 중간 인증서 → 루트 인증서.
     - **신뢰성 확인**: 체인의 루트 인증서가 브라우저나 운영 체제에 신뢰된 CA 목록에 포함되어 있는지 확인함
       - 신뢰되지 않는 루트 인증서를 사용하는 경우 브라우저는 경고를 표시함 (가끔 보이지?)
4. 체인 확인이 끝난 후, 브라우저는 추가적으로 인증서의 유효성을 검증함
  - 유효 기간: 현재 날짜가 인증서의 발급일과 만료일 사이인지 확인
  - 도메인 이름: 인증서의 CN (Common Name) 또는 SAN (Subject Alternative Name)이 요청한 도메인과 일치하는지 확인.
    - 예: https://example.com에 접속했는데 인증서가 *.example.com으로 발급되었다면 성공.
  - CRL/OCSP 확인: 인증서가 폐기되었는지 확인.
    - CRL (Certificate Revocation List): CA가 관리하는 폐기된 인증서 목록.
    - OCSP (Online Certificate Status Protocol): 인증서의 실시간 상태를 확인.

>추가로: 브라우저가 CA를 신뢰하는 이유
브라우저나 운영 체제는 "신뢰할 수 있는 루트 인증서" 목록을 미리 가지고 있음
이 목록은 각 브라우저 제작사 (예: Google, Mozilla)나 OS 제작사 (예: Microsoft, Apple)가 관리함
사용자는 이 목록에 인증서를 추가하거나 제거할 수 있지만, 기본적으로 신뢰된 CA는 철저한 검증 과정을 거침


#### 🥸**근데 중간 인증서는 왜필요한거임?**

보안, 효율성... 등등. 이건 구글에 찾아보렴 😩

#### 😆**마지막으로 만약 회사처럼 사내망이 구축되어있으면 어케해야댐? 사내에서 외부CA 써서 막 하진 않을꺼 아니야**

너(회사포함)가 자체적으로 개인 CA를 호스팅 하면됨.  
(Symantec 같은 CA들 돈벌이 수단중 하나임. 사내환경에 개인 CA를 쉽게 구축할 수 있도록 하는 서비스를 제공해주는거지)
회사에서 직접 구축한 CA에서 사인한 certificate을 사내 서버에 설치 하면 인증이 가능함.   
또 사원들이 다운로드 할 수 있는 certificate들도 있는데 이런경우는 개인이 자신의 신원을 인증하는데도 쓰임.  
브라우저에 등록해서 사내 웹사이트를 접근한다거나... 뭐 다운을 받는다거나 뭐 그런거지.

이정도 쓰니가 나도 좀 이해가 가네.


