from datetime import datetime
from typing import Any
import uuid

from app.domain.bebes.bebe_entity import Bebe


class BebeFactory:
    """Factory — única porta de criação de Bebe."""

    @staticmethod
    def make_bebe(dto: Any) -> Bebe:
        """Cria uma nova entidade Bebe a partir de um DTO."""
        return Bebe(
            id=str(uuid.uuid4()),
            nome=BebeFactory.nome_from(dto),
            data_nascimento=BebeFactory.data_nascimento_from(dto),
            genero=BebeFactory.genero_from(dto),
            foto=getattr(dto, "foto", None),
            ativo=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )

    @staticmethod
    def nome_from(dto: Any) -> str:
        return dto.nome

    @staticmethod
    def data_nascimento_from(dto: Any):
        return dto.data_nascimento

    @staticmethod
    def genero_from(dto: Any) -> str:
        return dto.genero
