"""Mapper para RegistroAlergenico — Entity → Response DTO."""

from app.schemas.alergenicos.responses import AlergenicoResponse, PodeOferecerResponse


class AlergenicoMapper:
    """Converte entidades RegistroAlergenico para DTOs de resposta."""

    @staticmethod
    def to_public(entity) -> AlergenicoResponse:
        """Converte para resposta pública completa."""
        return AlergenicoResponse(
            id=entity.id,
            bebe_id=entity.bebe_id,
            nome_alimento=entity.nome_alimento,
            numero_oferta=entity.numero_oferta,
            data_oferta=entity.data_oferta,
            teve_reacao=entity.teve_reacao,
            sintomas=entity.sintomas,
            notas=entity.notas,
            created_at=entity.created_at,
        )

    @staticmethod
    def to_pode_oferecer(data: dict) -> PodeOferecerResponse:
        """Converte resultado de verificação para resposta."""
        return PodeOferecerResponse(**data)
