"""Mapper da entidade Bebe para DTOs de resposta."""

from app.domain.bebes.bebe_entity import Bebe
from app.schemas.bebes.responses import BebeDisplayResponse, BebeResponse


class BebeMapper:
    """Converte entidade para respostas HTTP."""

    @staticmethod
    def to_public(entity: Bebe) -> BebeResponse:
        return BebeResponse(
            id=entity.id,
            nome=entity.nome,
            data_nascimento=entity.data_nascimento,
            genero=entity.genero,
            foto=entity.foto,
            ativo=entity.ativo,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )

    @staticmethod
    def to_display(entity: Bebe) -> BebeDisplayResponse:
        return BebeDisplayResponse(
            id=entity.id,
            nome=entity.nome,
            idade_meses=entity.idade_em_meses(),
            fase_alimentar=entity.fase_alimentar(),
        )
