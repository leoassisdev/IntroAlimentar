"""Serviço de orquestração para RelatorioSemanal."""

from datetime import date, timedelta
from app.domain.relatorios.relatorio_factory import RelatorioFactory
from app.domain.relatorios.relatorio_entity import RelatorioSemanal


class RelatorioService:
    """Orquestra operações de relatórios semanais."""

    def __init__(self, registro_repo) -> None:
        self.registro_repo = registro_repo

    def gerar_relatorio(self, bebe_id: str, offset: int = 0) -> RelatorioSemanal:
        """Gera relatório semanal para um bebê."""
        hoje = date.today()
        inicio_semana = hoje - timedelta(days=hoje.weekday()) - timedelta(weeks=offset)
        fim_semana = inicio_semana + timedelta(days=6)

        registros = self.registro_repo.list_by_semana(bebe_id, inicio_semana, fim_semana)
        return RelatorioFactory.make_relatorio(bebe_id, inicio_semana, fim_semana, registros)
