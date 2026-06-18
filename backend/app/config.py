import os

from dotenv import load_dotenv


load_dotenv()


def get_env_value(name: str, default: str = "") -> str:
    value = os.getenv(name, default).strip()

    if value.startswith(f"{name}="):
        value = value.split("=", 1)[1].strip()

    if value.startswith(f"{name} "):
        value = value.split("=", 1)[-1].strip()

    return value.strip("\"'")


def get_env_url(name: str, default: str) -> str:
    return get_env_value(name, default).rstrip("/")


class Settings:
    APP_NAME = get_env_value("APP_NAME", "LaunchMind AI Backend")
    APP_VERSION = get_env_value("APP_VERSION", "1.0.0")
    DEBUG = os.getenv("DEBUG", "True").lower() == "true"
    DATABASE_URL = get_env_value("DATABASE_URL", "sqlite:///./launchmind.db")
    JWT_SECRET_KEY = get_env_value("JWT_SECRET_KEY", "change-this-secret-key")
    JWT_ALGORITHM = get_env_value("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    OPENROUTER_API_KEY = get_env_value("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL = get_env_value("OPENROUTER_MODEL", "openai/gpt-oss-120b:free")
    OPENROUTER_BASE_URL = get_env_url(
        "OPENROUTER_BASE_URL",
        "https://openrouter.ai/api/v1",
    )
    GOOGLE_CLIENT_ID = get_env_value("GOOGLE_CLIENT_ID", "")
    GOOGLE_CLIENT_SECRET = get_env_value("GOOGLE_CLIENT_SECRET", "")
    GOOGLE_REDIRECT_URI = get_env_value(
        "GOOGLE_REDIRECT_URI",
        "http://127.0.0.1:8000/auth/google/callback",
    )
    GITHUB_CLIENT_ID = get_env_value("GITHUB_CLIENT_ID", "")
    GITHUB_CLIENT_SECRET = get_env_value("GITHUB_CLIENT_SECRET", "")
    GITHUB_REDIRECT_URI = get_env_value(
        "GITHUB_REDIRECT_URI",
        "http://127.0.0.1:8000/auth/github/callback",
    )
    FRONTEND_URL = get_env_url("FRONTEND_URL", "http://localhost:3000")
    SMTP_HOST = get_env_value("SMTP_HOST", "")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = get_env_value("SMTP_USERNAME", "")
    SMTP_PASSWORD = get_env_value("SMTP_PASSWORD", "")
    SMTP_FROM_EMAIL = get_env_value("SMTP_FROM_EMAIL", "")


settings = Settings()
