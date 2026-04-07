"""Payloads usados por integrações de IA relacionadas a bebes."""

from pydantic import BaseModel, Field


class BebeContextPayload(BaseModel):
    """Contexto resumido para futuras integrações de IA."""

    nome: str = Field(..., description="Nome do bebe.")
    idade_meses: int = Field(..., description="Idade atual em meses.")
    fase_alimentar: str = Field(..., description="Fase alimentar calculada.")
