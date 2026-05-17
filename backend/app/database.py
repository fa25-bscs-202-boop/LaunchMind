from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings


connect_args = {}

if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def add_missing_user_columns_for_sqlite():
    """Add new auth columns to an existing development SQLite database."""
    if not settings.DATABASE_URL.startswith("sqlite"):
        return

    inspector = inspect(engine)

    if "users" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("users")}
    required_columns = {
        "provider": "ALTER TABLE users ADD COLUMN provider VARCHAR",
        "provider_id": "ALTER TABLE users ADD COLUMN provider_id VARCHAR",
        "is_verified": "ALTER TABLE users ADD COLUMN is_verified BOOLEAN DEFAULT 1 NOT NULL",
        "verification_code_hash": "ALTER TABLE users ADD COLUMN verification_code_hash VARCHAR",
        "verification_code_expires_at": "ALTER TABLE users ADD COLUMN verification_code_expires_at DATETIME",
    }

    with engine.begin() as connection:
        for column_name, alter_sql in required_columns.items():
            if column_name not in existing_columns:
                connection.execute(text(alter_sql))
                print(f"Added missing users.{column_name} column to SQLite database.")
