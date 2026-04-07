"""Schemas de response para RelatorioSemanal."""

from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

from app.schemas.registros.responses import RegistroResponse


class RelatorioResponse(BaseModel):
    """Resposta pública de relatório semanal."""

    id: str
    bebe_id: str
    semana_inicio: date
    semana_fim: date
    total_frutas: int
    total_legumes: int
    total_proteinas: int
    total_cereais: int
    total_leguminosas: int
    total_folhosos: int
    total_agua_ml: float
    total_leite: float
    media_aceitacao: float
    alimentos_unicos: int
    registros: list[RegistroResponse]
    observacoes: list[str]
    generated_at: datetime


class RelatorioDisplayResponse(BaseModel):
    """Resposta simplificada de relatório."""

    id: str
    semana_inicio: date
    semana_fim: date
    media_aceitacao: float
    alimentos_unicos: int
    observacoes: list[str]
