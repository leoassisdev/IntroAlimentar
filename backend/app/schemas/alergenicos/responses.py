"""Schemas de response para RegistroAlergenico."""

from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional


class AlergenicoResponse(BaseModel):
    """Resposta pública de registro de alergênico."""

    id: str
    bebe_id: str
    nome_alimento: str
    numero_oferta: int
    data_oferta: date
    teve_reacao: bool
    sintomas: list[str]
    notas: Optional[str]
    created_at: datetime


class PodeOferecerResponse(BaseModel):
    """Resposta de verificação de disponibilidade."""

    alimento: str
    pode_oferecer: bool
    total_ofertas: int
    mensagem: str
