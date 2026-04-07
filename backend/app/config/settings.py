"""Configuracoes centralizadas da aplicacao."""

import os
from functools import lru_cache
from pathlib import Path

from pydantic import BaseModel, Field


class Settings(BaseModel):
    """Configuracoes do backend."""

    app_name: str = Field(default="IntroAlimentar API")
    database_url: str = Field(
        default_factory=lambda: os.getenv(
            "DATABASE_URL",
            f"sqlite:///{(Path(__file__).resolve().parents[2] / 'introalimentar.db').as_posix()}",
        )
    )
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )


@lru_cache
def get_settings() -> Settings:
    """Retorna configuracoes memoizadas."""

    return Settings()
