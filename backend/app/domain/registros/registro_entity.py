"""Entidade de dominio de registro alimentar."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime
from typing import Any


TIPOS_REFEICAO = {
    "cafe_manha",
    "almoco",
    "lanche_tarde",
    "jantar",
    "ceia",
    "mamada",
    "agua",
}

CATEGORIAS = {
    "frutas",
    "vegetais_folhosos",
    "legumes",
    "proteinas",
    "cereais",
    "leguminosas",
    "leite",
    "agua",
}

UNIDADES = {"ml", "min", "g", "porcao"}


@dataclass
class RegistroAlimentar:
    """Representa um registro alimentar do bebe."""

    id: str
    bebe_id: str
    data: date
    tipo_refeicao: str
    categoria: str
    nome_alimento: str
    tipo_corte: str | None
    aceitacao: int | None
    notas: str | None
    quantidade: float | None
    unidade: str | None
    alimento_alergenico: bool
    created_at: datetime

    def __post_init__(self) -> None:
        if self.tipo_refeicao not in TIPOS_REFEICAO:
            raise ValueError("Tipo de refeição inválido.")
        if self.categoria not in CATEGORIAS:
            raise ValueError("Categoria inválida.")
        if not self.nome_alimento.strip():
            raise ValueError("Nome do alimento é obrigatório.")
        if self.aceitacao is not None and not 1 <= self.aceitacao <= 5:
            raise ValueError("Aceitação deve estar entre 1 e 5.")
        if self.notas and len(self.notas) > 500:
            raise ValueError("Notas devem ter no máximo 500 caracteres.")
        if self.unidade is not None and self.unidade not in UNIDADES:
            raise ValueError("Unidade inválida.")
        if self.tipo_refeicao in {"agua", "mamada"} and self.aceitacao is not None:
            raise ValueError("Água e mamada não devem ter nota de aceitação.")

    @staticmethod
    def _get(data: Any, field_name: str, default: Any = None) -> Any:
        if isinstance(data, dict):
            return data.get(field_name, default)
        return getattr(data, field_name, default)

    def aplicar_atualizacao_from_any(self, data: Any) -> None:
        payload = data if isinstance(data, dict) else getattr(data, "model_dump", lambda **_: {})(
            exclude_unset=True
        )
        for key, value in payload.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)

    def esta_na_mesma_semana(self, outro: "RegistroAlimentar") -> bool:
        return self.data.isocalendar()[:2] == outro.data.isocalendar()[:2]

    def pertence_a_regra_dos_3(self, registros_semana: list["RegistroAlimentar"]) -> bool:
        total = sum(
            1
            for registro in registros_semana
            if registro.categoria == self.categoria
            and registro.nome_alimento.strip().lower() == self.nome_alimento.strip().lower()
        )
        return total >= 3

    @classmethod
    def now(cls) -> datetime:
        return datetime.now(UTC)
