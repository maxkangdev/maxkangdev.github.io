+++
date = '2024-12-26T21:58:25+09:00'
draft = true
title = 'Loading environment variables from .env'
tags = ["fastapi","uv"]
categories = ["dev|개발"]
+++

### Package 설치  

```zsh 
uv add python-dotenv
uv add pydantic-settings
```

### .env 에서 값 로딩하기 

```python
# config/settings.py

from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv


load_dotenv()   # Load the .env file


class DatabaseSettings(BaseSettings):
    DB_TYPE: str
    DB_USERNAME: str
    DB_PASSWORD: str
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str
    DATABASE_URL: str = ""

    # 불필요한 값(AuthSettings)이 DatabaseSettings에 들어가지 않도록 extra="ignore" 로 설정
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

class AuthSettings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # 불필요한 값(DatabaseSettings)이 AuthSettings에 들어가지 않도록 extra="ignore" 로 설정
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


# 생성 
db_settings = DatabaseSettings()
auth_settings = AuthSettings()
```

```yaml
# .env

DB_TYPE=postgresql
DB_USERNAME=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
DB_HOST=localhost
DB_PORT=5432

SECRET_KEY = "mykey"
ALGORITHM = "HS256"
```

### 사용 

```python 
# main.py

from app.config.settings import db_settings, auth_settings

@app.get("/settings")
def settings():
    return db_settings, auth_settings
```

{{< figure src="/image/settings-api.png" alt="alt" width="800" height="500" >}}
