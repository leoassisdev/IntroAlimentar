"""DTOs de entrada do modulo de bebes."""

from datetime import date

from pydantic import BaseModel, Field


class CreateBebeRequest(BaseModel):
    """Request para criar um bebe."""

    nome: str = Field(..., min_length=2, max_length=100, description="Nome do bebe.")
    data_nascimento: date = Field(..., description="Data de nascimento do bebe.")
    genero: str = Field(..., description='Genero: "masculino", "feminino" ou "outro".')
    foto: str | None = Field(default=None, description="Foto em base64 data URL.")


class UpdateBebeRequest(BaseModel):
    """Request para atualizar um bebe."""

    nome: str | None = Field(default=None, min_length=2, max_length=100, description="Nome do bebe.")
    data_nascimento: date | None = Field(default=None, description="Data de nascimento.")
    genero: str | None = Field(default=None, description="Genero do bebe.")
    foto: str | None = Field(default=None, description="Foto em base64 data URL.")
    ativo: bool | None = Field(default=None, description="Status logico do perfil.")


class PaginationQuery(BaseModel):
    """Query simples de listagem."""

    offset: int = Field(default=0, ge=0, description="Deslocamento da paginacao.")
    limit: int = Field(default=20, ge=1, le=100, description="Limite de itens.")
