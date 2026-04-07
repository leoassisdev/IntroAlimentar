"""Factory para RegistroAlergenico — única porta de criação."""

from datetime import datetime
import uuid
from app.domain.alergenicos.alergenico_entity import RegistroAlergenico


class RegistroAlergenicoFactory:
    """Fábrica para criar entidades RegistroAlergenico."""

    @staticmethod
    def make_alergenico(dto) -> RegistroAlergenico:
        """Cria um RegistroAlergenico a partir de um DTO."""
        return RegistroAlergenico(
            id=str(uuid.uuid4()),
            bebe_id=RegistroAlergenicoFactory.bebe_id_from(dto),
            nome_alimento=RegistroAlergenicoFactory.nome_alimento_from(dto),
            numero_oferta=RegistroAlergenicoFactory.numero_oferta_from(dto),
            data_oferta=RegistroAlergenicoFactory.data_oferta_from(dto),
            teve_reacao=getattr(dto, "teve_reacao", False),
            sintomas=getattr(dto, "sintomas", []) or [],
            notas=getattr(dto, "notas", None),
            created_at=datetime.utcnow(),
        )

    @staticmethod
    def bebe_id_from(dto) -> str:
        return dto.bebe_id

    @staticmethod
    def nome_alimento_from(dto) -> str:
        return dto.nome_alimento

    @staticmethod
    def numero_oferta_from(dto) -> int:
        return dto.numero_oferta

    @staticmethod
    def data_oferta_from(dto):
        return dto.data_oferta
