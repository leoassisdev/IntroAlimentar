"""Mapper para RelatorioSemanal — Entity → Response DTO."""

from app.schemas.relatorios.responses import RelatorioResponse, RelatorioDisplayResponse
from app.schemas.registros.responses import RegistroResponse


class RelatorioMapper:
    """Converte entidades RelatorioSemanal para DTOs de resposta."""

    @staticmethod
    def to_public(entity) -> RelatorioResponse:
        """Converte para resposta pública completa."""
        registros_dto = [RegistroResponse(**r.__dict__) for r in entity.registros]
        return RelatorioResponse(
            id=entity.id,
            bebe_id=entity.bebe_id,
            semana_inicio=entity.semana_inicio,
            semana_fim=entity.semana_fim,
            total_frutas=entity.total_frutas,
            total_legumes=entity.total_legumes,
            total_proteinas=entity.total_proteinas,
            total_cereais=entity.total_cereais,
            total_leguminosas=entity.total_leguminosas,
            total_folhosos=entity.total_folhosos,
            total_agua_ml=entity.total_agua_ml,
            total_leite=entity.total_leite,
            media_aceitacao=entity.media_aceitacao,
            alimentos_unicos=entity.alimentos_unicos,
            registros=registros_dto,
            observacoes=entity.observacoes,
            generated_at=entity.generated_at,
        )

    @staticmethod
    def to_display(entity) -> RelatorioDisplayResponse:
        """Converte para resposta simplificada."""
        return RelatorioDisplayResponse(
            id=entity.id,
            semana_inicio=entity.semana_inicio,
            semana_fim=entity.semana_fim,
            media_aceitacao=entity.media_aceitacao,
            alimentos_unicos=entity.alimentos_unicos,
            observacoes=entity.observacoes,
        )
