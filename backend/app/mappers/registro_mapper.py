"""Mapper para RegistroAlimentar — Entity → Response DTO."""

from app.schemas.registros.responses import RegistroResponse, RegistroDisplayResponse, SemanaAtualResponse


class RegistroMapper:
    """Converte entidades RegistroAlimentar para DTOs de resposta."""

    @staticmethod
    def to_public(entity) -> RegistroResponse:
        """Converte para resposta pública completa."""
        return RegistroResponse(**entity.__dict__)

    @staticmethod
    def to_display(entity) -> RegistroDisplayResponse:
        """Converte para resposta simplificada."""
        return RegistroDisplayResponse(
            id=entity.id,
            nome_alimento=entity.nome_alimento,
            tipo_refeicao=entity.tipo_refeicao,
            categoria=entity.categoria,
            aceitacao=entity.aceitacao,
            data=entity.data,
        )

    @staticmethod
    def to_semana_atual(categoria: str, alimentos: list[str]) -> SemanaAtualResponse:
        """Converte dados de semana atual para resposta."""
        return SemanaAtualResponse(
            categoria=categoria,
            alimentos=alimentos,
            total=len(alimentos),
        )
