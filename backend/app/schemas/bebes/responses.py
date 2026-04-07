"""DTOs de saida do modulo de bebes."""

from datetime import date, datetime

from pydantic import BaseModel, Field


class BebeResponse(BaseModel):
    """Resposta completa de bebe."""

    id: str = Field(..., description="Identificador do bebe.")
    nome: str = Field(..., description="Nome do bebe.")
    data_nascimento: date = Field(..., description="Data de nascimento.")
    genero: str = Field(..., description="Genero.")
    foto: str | None = Field(default=None, description="Foto em base64.")
    ativo: bool = Field(..., description="Status logico.")
    created_at: datetime = Field(..., description="Criado em.")
    updated_at: datetime = Field(..., description="Atualizado em.")
 

class BebeDisplayResponse(BaseModel):
    """Resposta simplificada para display."""

    id: str = Field(..., description="Identificador do bebe.")
    nome: str = Field(..., description="Nome do bebe.")
    idade_meses: int = Field(..., description="Idade em meses.")
    fase_alimentar: str = Field(..., description="Fase alimentar.")
