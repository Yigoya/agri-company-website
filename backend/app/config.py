from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "GreenFields Agriculture API"
    API_V1_STR: str = "/api/v1"

    POSTGRES_USER: str = "agriuser"
    POSTGRES_PASSWORD: str = "agripass123"
    POSTGRES_DB: str = "agridb"
    POSTGRES_HOST: str = "postgres"
    POSTGRES_PORT: str = "5432"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost",
        "http://localhost:5173",
    ]

    UPLOAD_DIR: str = "/app/uploads"

    ADMIN_EMAIL: str = "admin@greenfields.com"
    ADMIN_PASSWORD: str = "admin123"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
