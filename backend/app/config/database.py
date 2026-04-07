"""Configuração do banco de dados — SQLite para V1, preparado para PostgreSQL."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "sqlite:///./introalimentar.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency injection para sessão do banco."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
