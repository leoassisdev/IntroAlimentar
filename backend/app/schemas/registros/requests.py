"""Schemas de request para RegistroAlimentar."""

from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, Literal


class CreateRegistroRequest(BaseModel):
    """DTO para criação de registro alimentar."""

    bebe_id: str = Field(default="", description="Preenchido pela API via path param")
    data: date = Field(..., description="Data do registro")
    tipo_refeicao: Literal[
        "cafe_manha", "almoco", "lanche_tarde",
        "jantar", "ceia", "mamada", "agua"
    ] = Field(..., description="Tipo da refeição")
    categoria: Literal[
        "frutas", "vegetais_folhosos", "legumes",
        "proteinas", "cereais", "leguminosas", "leite", "agua"
    ] = Field(..., description="Categoria do alimento")
    nome_alimento: str = Field(..., min_length=1, description="Nome do alimento")
    tipo_corte: Optional[str] = Field(None, description="Tipo de corte usado")
    aceitacao: Optional[int] = Field(None, ge=1, le=5, description="Aceitação de 1 a 5")
    notas: Optional[str] = Field(None, max_length=500, description="Observações")
    quantidade: Optional[float] = Field(None, description="Quantidade oferecida")
    unidade: Optional[Literal["ml", "min", "g", "porcao"]] = Field(None, description="Unidade de medida")
    alimento_alergenico: bool = Field(False, description="Se o alimento é alergênico")


class UpdateRegistroRequest(BaseModel):
    """DTO para atualização parcial de registro alimentar."""

    data: Optional[date] = None
    tipo_refeicao: Optional[Literal[
        "cafe_manha", "almoco", "lanche_tarde",
        "jantar", "ceia", "mamada", "agua"
    ]] = None
    categoria: Optional[Literal[
        "frutas", "vegetais_folhosos", "legumes",
        "proteinas", "cereais", "leguminosas", "leite", "agua"
    ]] = None
    nome_alimento: Optional[str] = Field(None, min_length=1)
    tipo_corte: Optional[str] = None
    aceitacao: Optional[int] = Field(None, ge=1, le=5)
    notas: Optional[str] = Field(None, max_length=500)
    quantidade: Optional[float] = None
    unidade: Optional[Literal["ml", "min", "g", "porcao"]] = None
    alimento_alergenico: Optional[bool] = None
