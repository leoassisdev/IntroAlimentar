"""Responses do modulo de registros."""

from datetime import date, datetime

from pydantic import BaseModel, Field


class RegistroAlimentarResponse(BaseModel):
    id: str = Field(..., description="Identificador do registro.")
    bebe_id: str = Field(..., description="Identificador do bebê.")
    data: date = Field(..., description="Data do registro.")
    tipo_refeicao: str = Field(..., description="Tipo da refeição.")
    categoria: str = Field(..., description="Categoria do alimento.")
    nome_alimento: str = Field(..., description="Nome do alimento.")
    tipo_corte: str | None = Field(default=None, description="Tipo de corte.")
    aceitacao: int | None = Field(default=None, description="Aceitação de 1 a 5.")
    notas: str | None = Field(default=None, description="Observações.")
    quantidade: float | None = Field(default=None, description="Quantidade.")
    unidade: str | None = Field(default=None, description="Unidade.")
    alimento_alergenico: bool = Field(..., description="Se é alergênico.")
    created_at: datetime = Field(..., description="Criado em.")
