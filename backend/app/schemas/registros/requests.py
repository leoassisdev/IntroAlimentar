"""Requests do modulo de registros."""

from datetime import date
from typing import Literal

from pydantic import BaseModel, Field


class CreateRegistroRequest(BaseModel):
    data: date = Field(..., description="Data do registro.")
    tipo_refeicao: Literal[
        "cafe_manha",
        "almoco",
        "lanche_tarde",
        "jantar",
        "ceia",
        "mamada",
        "agua",
    ] = Field(..., description="Tipo da refeição.")
    categoria: Literal[
        "frutas",
        "vegetais_folhosos",
        "legumes",
        "proteinas",
        "cereais",
        "leguminosas",
        "leite",
        "agua",
    ] = Field(..., description="Categoria do alimento.")
    nome_alimento: str = Field(..., min_length=1, description="Nome do alimento.")
    tipo_corte: str | None = Field(default=None, description="Corte sugerido.")
    aceitacao: int | None = Field(default=None, ge=1, le=5, description="Aceitação de 1 a 5.")
    notas: str | None = Field(default=None, max_length=500, description="Observações do registro.")
    quantidade: float | None = Field(default=None, description="Quantidade consumida.")
    unidade: Literal["ml", "min", "g", "porcao"] | None = Field(default=None, description="Unidade.")
    alimento_alergenico: bool = Field(default=False, description="Indica se é alergênico.")


class UpdateRegistroRequest(BaseModel):
    data: date | None = Field(default=None, description="Data do registro.")
    tipo_refeicao: str | None = Field(default=None, description="Tipo da refeição.")
    categoria: str | None = Field(default=None, description="Categoria do alimento.")
    nome_alimento: str | None = Field(default=None, description="Nome do alimento.")
    tipo_corte: str | None = Field(default=None, description="Corte sugerido.")
    aceitacao: int | None = Field(default=None, ge=1, le=5, description="Aceitação de 1 a 5.")
    notas: str | None = Field(default=None, max_length=500, description="Observações.")
    quantidade: float | None = Field(default=None, description="Quantidade consumida.")
    unidade: str | None = Field(default=None, description="Unidade.")
    alimento_alergenico: bool | None = Field(default=None, description="Indica alergênico.")
