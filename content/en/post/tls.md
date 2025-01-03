+++
date = '2025-01-02T10:44:29+09:00'
draft = false
title = '[Kubernetes] What is TLS Certificate?'
tags = ["kubernetes"]
categories = ["devops"]
+++

In order to understand TLS Certificate, you first need to understand the following
- Symmetric Encryption
- Asymmetric Encryption
- Hybrid Encryption

## Symmetric Encryption

SSH is a well known example of an asymmetric encryption

- `Steps`
  1. **Key Generation**: A single secret key is generated for both encryption and decryption.
  2. **Encryption**: The sender encrypts the plaintext data using the secret key.
  3. **Transmission**: The encrypted data (ciphertext) is sent to the receiver.
  4. **Decryption**: The receiver decrypts the ciphertext using the same secret key to retrieve the original plaintext. 
- `Features`
  - **Single Key**: Both encryption and decryption are done using the same key.
  - **Fast Performance**: Symmetric encryption is faster than asymmetric encryption, making it ideal for large data sets.
  - **Security Depends on Key**: The security of the system relies on keeping the secret key confidential.
  - **Efficient for Bulk Data**: Often used in applications that require fast, bulk encryption, such as file systems and databases.
- `Common Algorithms `
  - AES, DES, 3DES, Blowfish, RC4, etc ...

> **Problem**   
> Since receiver needs both the key and the data, sender has to transmit both through the network,
exposing them to the hacker interception.   
> **Asymmetric Encryption** solves this problem 😆

## Asymmetric Encryption 
- `Steps`
  1. **Key Generation**: Two keys are generated—a public key and a private key. The public key is shared with others, while the private key is kept secret.
  2. **Encryption**: The sender encrypts the plaintext using the recipient's public key.
  3. **Transmission**: The encrypted data (ciphertext) is sent to the receiver.
  4. **Decryption**: The receiver decrypts the ciphertext using their private key to retrieve the original plaintext.
- `Features`
  - **Two Keys (Public and Private)**: The encryption is done with a public key, and decryption is done with a private key.
  - **Key Distribution**: No need to share a private key; only the public key is shared, which simplifies secure key distribution.
  - **Slower than Symmetric Encryption**: Due to complex mathematical operations, asymmetric encryption is slower and less efficient for large amounts of data.
  - **High Security**: Even if the public key is known, the private key cannot be derived easily, providing high security for data transmission.
- `Common Algorithms `
    - RSA, ECC, DSA, Diffie-Hellman, etc ...


### Example (SSH)

**1. Key Generation**
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
# -t rsa: Specifies the RSA algorithm.
# -b 4096: Specifies the key length (4096 bits for stronger security).
# -C "your_email@example.com": Adds a comment, typically your email, for identification.

# Generated Files
# Private key: ~/.ssh/id_rsa
# Public key: ~/.ssh/id_rsa.pub
```

**2. Place Public Key on Server** 
```bash
ssh-copy-id username@remote_server_ip
# This will append the public key (id_rsa.pub) to the server's ~/.ssh/authorized_keys file, 
# allowing the client to authenticate using the corresponding private key.

# or you can manually add your public key
cat ~/.ssh/id_rsa.pub
echo "your_public_key_content" >> ~/.ssh/authorized_keys
```
*You will need password since this is the first time accessing the remote server. 

**3. Initiate SSH Connection (Client Side):**
```bash
ssh username@remote_server_ip
```

## Hybrid Encryption (Best of Both)
- 
- `Steps`
  1. **Key Generation**
     - The sender generates a symmetric key (e.g., AES) to encrypt the actual data.
     - The recipient has a public-private key pair (asymmetric encryption).
  2. **Symmetric Key Encryption**
     - The sender encrypts the symmetric key using the recipient’s public key (asymmetric encryption).
  3. **Send Encrypted Key and Data**
     - The sender transmits the encrypted symmetric key and the symmetrically encrypted data to the recipient.
  4. **Symmetric Key Decryption**
     - The recipient uses their private key to decrypt the symmetric key.
  5. **Data Decryption**
     - The recipient uses the decrypted symmetric key to decrypt the actual data.
- `Key Features`
  - **Combines Both Encryption Types**: Asymmetric encryption secures the symmetric key exchange, while symmetric encryption efficiently handles the bulk data encryption.
  - **Security and Speed**: Hybrid encryption leverages the high security of asymmetric encryption for key exchange and the fast performance of symmetric encryption for large data processing.
  - **Common in Secure Communications**: Frequently used in protocols like HTTPS, where both security and speed are important.
- `Algorithms`
  - Uses both symmetric and asymmetric encyrption 


> **Problem**  
> Suppose you are trying to login to a bank website using hybrid approach.  
> However, the hacker has created a fake website that looks exactly like the bank website and has routed your request to his 😈fake website😈  
> If this is the case, you will encrypt your symmetric key using the **public key of fake website** and send it to the hacker.
> Exposing your ID and Password as a result. ☠️  

## Certificate (TLS/SSL)

What if there is a way to check the legitimacy of the public key received from the bank website?!  
-> **Certificate  😤**

So sender sends certificate instead of public key

Example Certificate created by `openssl` 
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

**But can’t anyone (even hackers) just create a certificate? How is it different from a public key?**

Yep, you’re right. Certificates can be created and signed by anyone, even 😈 individuals 😈. But if a certificate is signed by an individual, it’s not secure.  
That’s why certificates signed by trusted authorities (aka Certificate Authorities or CAs) are considered safe. There are well-known CAs like Symantec and DigiCert.

Here’s how the issuance process works:



### **Steps**
_First, you need to understand that CAs have their own unique private and public keys. Got it?_

1. The server generates its own private and public keys.
2. A CSR (Certificate Signing Request) is created, which includes the following information:
  - **Domain Name (CN, Common Name):** The domain the certificate will be applied to.
  - **Organization Information:** Company name, location, etc.
  - **Public Key**
3. The CSR is sent to the CA, saying, “Here’s the paperwork; please issue a certificate!”
4. The CA verifies the domain ownership using methods like:
  - **DNS Verification:** Adding a specific TXT record to the domain's DNS.
  - **HTTP Verification:** Uploading a file provided by the CA to a specific URL.
  - **Email Verification:** Sending a verification link to the domain admin's email.
5. Once verified, the CA issues the certificate (usually in `.crt` or `.cer` format).
6. The server installs and configures the issued certificate.
7. When a user tries to send data to the server, they’ll receive this issued certificate!


#### 🤓 **Hmm... Okay, I understand how a certificate is issued. But how does the browser know that entities like Symantec are really trusted CAs?** 🤓  
#### ☠️ **And even if they are trusted, how do we know the certificates were genuinely signed by them? Isn’t forgery possible?** ☠️

This is solved as follows:

1. The browser receives the certificate from the server. The certificate contains:
   - The server’s public key.
   - The server’s domain name.
   - Information about the issuing CA.
   - The validity period (issue date and expiration date).
   - A digital signature of the server owner (signed with the CA’s private key).
2. **Certificate Chain Validation**
   - The certificate chain consists of:
     - **Server Certificate:** Provided by the server.
     - **Intermediate Certificate:** Issued by an intermediate CA.
     - **Root Certificate:** Issued by a trusted root CA.
   - Servers typically provide the server certificate and intermediate certificate together.
   - Browsers have a list of trusted root certificates pre-installed.
3. **Matching the Root Certificate**
   - The browser starts with the server’s certificate and verifies each level up to the root certificate:
     - **Signature Validation:** Ensuring each certificate is signed by the public key of the certificate above it.
       - E.g., Server Certificate → Intermediate Certificate → Root Certificate.
     - **Trust Check:** Verifying that the root certificate is in the browser or OS’s trusted CA list.
       - If the root certificate isn’t trusted, the browser displays a warning (you’ve probably seen this).
4. **Additional Validations**
   - **Validity Period:** Ensuring the current date is within the certificate’s issue and expiry dates.
   - **Domain Name Match:** Checking if the certificate’s CN (Common Name) or SAN (Subject Alternative Name) matches the requested domain.
     - Example: If you access `https://example.com` and the certificate is for `*.example.com`, it’s valid.
   - **CRL/OCSP Check:** Ensuring the certificate hasn’t been revoked.
     - **CRL (Certificate Revocation List):** A list of revoked certificates managed by the CA.
     - **OCSP (Online Certificate Status Protocol):** Real-time certificate status check._



> **Why does the browser trust the CA in the first place?**  
Browsers or operating systems maintain a list of "Trusted Root Certificates."
- This list is managed by browser vendors (e.g., Google, Mozilla) or OS providers (e.g., Microsoft, Apple).
- Users can add or remove certificates from this list, but the default trusted CAs undergo strict vetting.



#### 🥸**Why do we need intermediate certificates?**

For security, efficiency, and other reasons. Look it up on Google 😩.



#### 😆**What if it’s a private network like a company? Surely they don’t use external CAs for everything, right?**

In that case, you (or the company) can host your own Certificate Authority (CA).  
(Symantec and similar CAs provide services to help companies easily set up their own CAs for internal environments.)  
If the company hosts its own CA, certificates signed by that CA can be installed on internal servers for authentication.  
Employees might also have downloadable certificates that are used for identifying themselves. These are commonly registered in browsers for accessing internal websites or downloading internal resources.



