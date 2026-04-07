"""Schemas de request para RegistroAlergenico."""

from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, Literal


class CreateAlergenicoRequest(BaseModel):
    """DTO para criação de registro de alergênico."""

    bebe_id: str = Field(default="", description="Preenchido pela API via path param")
    nome_alimento: Literal[
        "Ovos (clara e gema)",
        "Amendoim",
        "Castanhas",
        "Trigo",
        "Soja e derivados",
        "Peixe e frutos do mar",
        "Leite de vaca",
        "Kiwi",
        "Morango",
    ] = Field(..., description="Alimento alergênico")
    numero_oferta: int = Field(..., ge=1, le=5, description="Número da oferta (1-5)")
    data_oferta: date = Field(..., description="Data da oferta")
    teve_reacao: bool = Field(False, description="Se houve reação alérgica")
    sintomas: Optional[list[str]] = Field(None, description="Lista de sintomas observados")
    notas: Optional[str] = Field(None, description="Observações adicionais")
