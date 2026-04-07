"""Schemas de response para RegistroAlimentar."""

from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class RegistroResponse(BaseModel):
    """Resposta pública de registro alimentar."""

    id: str
    bebe_id: str
    data: date
    tipo_refeicao: str
    categoria: str
    nome_alimento: str
    tipo_corte: Optional[str]
    aceitacao: Optional[int]
    notas: Optional[str]
    quantidade: Optional[float]
    unidade: Optional[str]
    alimento_alergenico: bool
    created_at: datetime


class RegistroDisplayResponse(BaseModel):
    """Resposta simplificada para listagens."""

    id: str
    nome_alimento: str
    tipo_refeicao: str
    categoria: str
    aceitacao: Optional[int]
    data: date


class SemanaAtualResponse(BaseModel):
    """Alimentos usados na semana atual por categoria."""

    categoria: str
    alimentos: list[str]
    total: int
