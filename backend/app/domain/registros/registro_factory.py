"""Factory do registro alimentar."""

from __future__ import annotations

from uuid import uuid4

from app.domain.registros.registro_entity import RegistroAlimentar


class RegistroAlimentarFactory:
    """Factory única do registro alimentar."""

    @staticmethod
    def make_registro(dto: object, bebe_id: str) -> RegistroAlimentar:
        return RegistroAlimentar(
            id=str(getattr(dto, "id", None) or uuid4()),
            bebe_id=bebe_id,
            data=RegistroAlimentarFactory.data_from(dto),
            tipo_refeicao=RegistroAlimentarFactory.tipo_refeicao_from(dto),
            categoria=RegistroAlimentarFactory.categoria_from(dto),
            nome_alimento=RegistroAlimentarFactory.nome_alimento_from(dto),
            tipo_corte=getattr(dto, "tipo_corte", None),
            aceitacao=getattr(dto, "aceitacao", None),
            notas=getattr(dto, "notas", None),
            quantidade=getattr(dto, "quantidade", None),
            unidade=getattr(dto, "unidade", None),
            alimento_alergenico=bool(getattr(dto, "alimento_alergenico", False)),
            created_at=getattr(dto, "created_at", None) or RegistroAlimentar.now(),
        )

    @staticmethod
    def data_from(dto: object):
        return getattr(dto, "data")

    @staticmethod
    def tipo_refeicao_from(dto: object) -> str:
        return str(getattr(dto, "tipo_refeicao")).strip().lower()

    @staticmethod
    def categoria_from(dto: object) -> str:
        return str(getattr(dto, "categoria")).strip().lower()

    @staticmethod
    def nome_alimento_from(dto: object) -> str:
        return str(getattr(dto, "nome_alimento")).strip()
