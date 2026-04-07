"""Mapper de registros alimentares."""

from app.domain.registros.registro_entity import RegistroAlimentar
from app.schemas.registros.responses import RegistroAlimentarResponse


class RegistroAlimentarMapper:
    """Converte entidade em DTO de resposta."""

    @staticmethod
    def to_public(entity: RegistroAlimentar) -> RegistroAlimentarResponse:
        return RegistroAlimentarResponse(**entity.__dict__)
