"""Entidade de domínio RegistroAlergenico — pura, sem dependências externas."""

from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional


@dataclass
class RegistroAlergenico:
    """Registro de oferta de alimento alergênico ao bebê."""

    id: str
    bebe_id: str
    nome_alimento: str
    numero_oferta: int
    data_oferta: date
    teve_reacao: bool
    sintomas: list[str]
    notas: Optional[str]
    created_at: datetime

    ALIMENTOS_ALERGENICOS = (
        "Ovos (clara e gema)",
        "Amendoim",
        "Castanhas",
        "Trigo",
        "Soja e derivados",
        "Peixe e frutos do mar",
        "Leite de vaca",
        "Kiwi",
        "Morango",
    )

    SINTOMAS_ATENCAO = (
        "Vermelhidão ou surgimento de manchas na pele",
        "Coceira na região da boca",
        "Inchaço nos lábios ou no rosto",
        "Dificuldade para respirar (EMERGÊNCIA)",
        "Vômito",
        "Diarreia",
        "Irritabilidade / choro intenso",
    )

    def __post_init__(self) -> None:
        """Validações de domínio."""
        if self.nome_alimento not in self.ALIMENTOS_ALERGENICOS:
            raise ValueError(f"Alimento alergênico inválido: {self.nome_alimento}")

        if not (1 <= self.numero_oferta <= 5):
            raise ValueError("Número de oferta deve ser entre 1 e 5")

        if self.teve_reacao and not self.sintomas:
            raise ValueError("Sintomas obrigatórios quando houve reação")

    @staticmethod
    def total_ofertas(registros: list["RegistroAlergenico"], alimento: str) -> int:
        """Conta total de ofertas de um alimento."""
        return sum(1 for r in registros if r.nome_alimento == alimento)

    @staticmethod
    def pode_oferecer(registros: list["RegistroAlergenico"], alimento: str, data_pretendida: date) -> bool:
        """Verifica se pode oferecer o alimento respeitando intervalo de 3 dias."""
        ofertas_alimento = [r for r in registros if r.nome_alimento == alimento]

        if len(ofertas_alimento) >= 5:
            return False

        for r in ofertas_alimento:
            diff = abs((data_pretendida - r.data_oferta).days)
            if diff < 3:
                return False

        return True

    def aplicar_atualizacao_from_any(self, data: dict) -> None:
        """Aplica atualização parcial."""
        for key, value in data.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)
