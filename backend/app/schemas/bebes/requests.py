from pydantic import BaseModel, Field
from datetime import date
from typing import Optional, Literal


class CreateBebeRequest(BaseModel):
    """DTO para criação de bebê."""

    nome: str = Field(..., min_length=2, max_length=100, description="Nome do bebê")
    data_nascimento: date = Field(..., description="Data de nascimento do bebê")
    genero: Literal["masculino", "feminino", "outro"] = Field(..., description="Gênero do bebê")
    foto: Optional[str] = Field(None, description="Foto em base64 data URL")


class UpdateBebeRequest(BaseModel):
    """DTO para atualização parcial de bebê."""

    nome: Optional[str] = Field(None, min_length=2, max_length=100, description="Nome do bebê")
    data_nascimento: Optional[date] = Field(None, description="Data de nascimento")
    genero: Optional[Literal["masculino", "feminino", "outro"]] = Field(None, description="Gênero")
    foto: Optional[str] = Field(None, description="Foto em base64 data URL")
