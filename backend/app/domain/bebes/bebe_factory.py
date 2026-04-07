"""Factory unica para criacao da entidade Bebe."""

from __future__ import annotations

from datetime import UTC, datetime
from uuid import uuid4

from app.domain.bebes.bebe_entity import Bebe


class BebeFactory:
    """Factory unica da entidade Bebe."""

    @staticmethod
    def make_bebe(dto: object) -> Bebe:
        """Cria um bebe a partir de um DTO."""

        agora = datetime.now(UTC)
        return Bebe(
            id=BebeFactory.id_from(dto),
            nome=BebeFactory.nome_from(dto),
            data_nascimento=BebeFactory.data_nascimento_from(dto),
            genero=BebeFactory.genero_from(dto),
            foto=BebeFactory.foto_from(dto),
            ativo=BebeFactory.ativo_from(dto),
            created_at=BebeFactory.created_at_from(dto, agora),
            updated_at=BebeFactory.updated_at_from(dto, agora),
        )

    @staticmethod
    def id_from(dto: object) -> str:
        return getattr(dto, "id", None) or str(uuid4())

    @staticmethod
    def nome_from(dto: object) -> str:
        return str(getattr(dto, "nome")).strip()

    @staticmethod
    def data_nascimento_from(dto: object):
        return getattr(dto, "data_nascimento")

    @staticmethod
    def genero_from(dto: object) -> str:
        return str(getattr(dto, "genero")).strip().lower()

    @staticmethod
    def foto_from(dto: object) -> str | None:
        return getattr(dto, "foto", None)

    @staticmethod
    def ativo_from(dto: object) -> bool:
        return bool(getattr(dto, "ativo", True))

    @staticmethod
    def created_at_from(dto: object, fallback: datetime) -> datetime:
        return getattr(dto, "created_at", None) or fallback

    @staticmethod
    def updated_at_from(dto: object, fallback: datetime) -> datetime:
        return getattr(dto, "updated_at", None) or fallback
