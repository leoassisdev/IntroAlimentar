"""Entidade de domínio RelatorioSemanal — pura, sem dependências externas."""

from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional


@dataclass
class RelatorioSemanal:
    """Relatório semanal de alimentação do bebê."""

    id: str
    bebe_id: str
    semana_inicio: date
    semana_fim: date
    total_frutas: int
    total_legumes: int
    total_proteinas: int
    total_cereais: int
    total_leguminosas: int
    total_folhosos: int
    total_agua_ml: float
    total_leite: float
    media_aceitacao: float
    alimentos_unicos: int
    registros: list
    observacoes: list[str]
    generated_at: datetime

    def alimentos_baixa_aceitacao(self) -> list[str]:
        """Identifica alimentos com baixa aceitação (<=2)."""
        return list({
            r.nome_alimento for r in self.registros
            if r.aceitacao is not None and r.aceitacao <= 2
        })

    def regra_dos_3_seguida(self) -> dict[str, bool]:
        """Verifica se a Regra dos 3 foi seguida por categoria."""
        categorias_checadas = ("frutas", "legumes", "proteinas")
        resultado: dict[str, bool] = {}

        for cat in categorias_checadas:
            alimentos_cat = {r.nome_alimento for r in self.registros if r.categoria == cat}
            resultado[cat] = len(alimentos_cat) >= 3

        return resultado

    def gerar_observacoes(self) -> list[str]:
        """Gera observações automáticas do relatório."""
        obs: list[str] = []

        baixa = self.alimentos_baixa_aceitacao()
        if baixa:
            obs.append(f"Alimentos com baixa aceitação: {', '.join(baixa)}")

        regra = self.regra_dos_3_seguida()
        for cat, seguida in regra.items():
            if not seguida:
                obs.append(f"Regra dos 3 NÃO seguida para {cat} — menos de 3 alimentos diferentes")

        if self.total_folhosos == 0:
            obs.append("Nenhum vegetal folhoso oferecido na semana")

        if self.total_agua_ml < 100:
            obs.append("Baixa ingestão de água na semana")

        return obs
