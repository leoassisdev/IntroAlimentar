"""Factory para criação de RegistroAlimentar — única porta de criação."""

from datetime import datetime
import uuid
from app.domain.registros.registro_entity import RegistroAlimentar


class RegistroAlimentarFactory:
    """Fábrica para criar entidades RegistroAlimentar."""

    @staticmethod
    def make_registro(dto) -> RegistroAlimentar:
        """Cria um RegistroAlimentar a partir de um DTO."""
        return RegistroAlimentar(
            id=str(uuid.uuid4()),
            bebe_id=RegistroAlimentarFactory.bebe_id_from(dto),
            data=RegistroAlimentarFactory.data_from(dto),
            tipo_refeicao=RegistroAlimentarFactory.tipo_refeicao_from(dto),
            categoria=RegistroAlimentarFactory.categoria_from(dto),
            nome_alimento=RegistroAlimentarFactory.nome_alimento_from(dto),
            tipo_corte=getattr(dto, "tipo_corte", None),
            aceitacao=getattr(dto, "aceitacao", None),
            notas=getattr(dto, "notas", None),
            quantidade=getattr(dto, "quantidade", None),
            unidade=getattr(dto, "unidade", None),
            alimento_alergenico=getattr(dto, "alimento_alergenico", False),
            created_at=datetime.utcnow(),
        )

    @staticmethod
    def bebe_id_from(dto) -> str:
        return dto.bebe_id

    @staticmethod
    def data_from(dto):
        return dto.data

    @staticmethod
    def tipo_refeicao_from(dto) -> str:
        return dto.tipo_refeicao

    @staticmethod
    def categoria_from(dto) -> str:
        return dto.categoria

    @staticmethod
    def nome_alimento_from(dto) -> str:
        return dto.nome_alimento
