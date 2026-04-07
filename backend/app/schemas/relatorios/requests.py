"""Schemas de request para RelatorioSemanal."""

from pydantic import BaseModel, Field
from typing import Optional


class RelatorioQueryParams(BaseModel):
    """Parâmetros de query para relatório semanal."""

    offset: int = Field(0, ge=0, description="Offset de semanas (0=atual, 1=anterior, etc.)")
