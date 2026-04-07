"""Factory para RelatorioSemanal — cria relatório a partir de registros."""

from datetime import date, datetime
import uuid
from app.domain.relatorios.relatorio_entity import RelatorioSemanal


class RelatorioFactory:
    """Fábrica para criar entidades RelatorioSemanal."""

    @staticmethod
    def make_relatorio(bebe_id: str, semana_inicio: date, semana_fim: date, registros: list) -> RelatorioSemanal:
        """Cria um RelatorioSemanal a partir dos registros da semana."""
        total_frutas = sum(1 for r in registros if r.categoria == "frutas")
        total_legumes = sum(1 for r in registros if r.categoria == "legumes")
        total_proteinas = sum(1 for r in registros if r.categoria == "proteinas")
        total_cereais = sum(1 for r in registros if r.categoria == "cereais")
        total_leguminosas = sum(1 for r in registros if r.categoria == "leguminosas")
        total_folhosos = sum(1 for r in registros if r.categoria == "vegetais_folhosos")

        total_agua_ml = sum(
            r.quantidade or 0 for r in registros
            if r.categoria == "agua" and r.unidade == "ml"
        )
        total_leite = sum(
            r.quantidade or 0 for r in registros
            if r.categoria == "leite"
        )

        aceitacoes = [r.aceitacao for r in registros if r.aceitacao is not None]
        media_aceitacao = sum(aceitacoes) / len(aceitacoes) if aceitacoes else 0.0

        alimentos_unicos = len({r.nome_alimento for r in registros})

        relatorio = RelatorioSemanal(
            id=str(uuid.uuid4()),
            bebe_id=bebe_id,
            semana_inicio=semana_inicio,
            semana_fim=semana_fim,
            total_frutas=total_frutas,
            total_legumes=total_legumes,
            total_proteinas=total_proteinas,
            total_cereais=total_cereais,
            total_leguminosas=total_leguminosas,
            total_folhosos=total_folhosos,
            total_agua_ml=total_agua_ml,
            total_leite=total_leite,
            media_aceitacao=round(media_aceitacao, 2),
            alimentos_unicos=alimentos_unicos,
            registros=registros,
            observacoes=[],
            generated_at=datetime.utcnow(),
        )

        relatorio.observacoes = relatorio.gerar_observacoes()
        return relatorio
