from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional


class BebeResponse(BaseModel):
    """Response pública completa de um bebê."""

    id: str
    nome: str
    data_nascimento: date
    genero: str
    foto: Optional[str]
    ativo: bool
    created_at: datetime
    updated_at: datetime


class BebeDisplayResponse(BaseModel):
    """Response simplificada para exibição (nome + idade)."""

    id: str
    nome: str
    idade_meses: int
    fase_alimentar: str
