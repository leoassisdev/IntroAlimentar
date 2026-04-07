"""Entidade principal do modulo de bebes."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, date, datetime
from typing import Any


VALID_GENEROS = {"masculino", "feminino", "outro"}


@dataclass
class Bebe:
    """Entidade de dominio que representa um bebe."""

    id: str
    nome: str
    data_nascimento: date
    genero: str
    foto: str | None
    ativo: bool
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        """Valida invariantes de dominio."""

        nome = self.nome.strip()
        if len(nome) < 2 or len(nome) > 100:
            raise ValueError("Nome do bebe deve ter entre 2 e 100 caracteres.")
        if self.data_nascimento > date.today():
            raise ValueError("Data de nascimento nao pode ser futura.")
        if self.genero not in VALID_GENEROS:
            raise ValueError("Genero invalido para bebe.")

    def idade_em_meses(self, referencia: date | None = None) -> int:
        """Calcula a idade atual em meses."""

        hoje = referencia or date.today()
        return (hoje.year - self.data_nascimento.year) * 12 + (
            hoje.month - self.data_nascimento.month
        )

    def fase_alimentar(self, referencia: date | None = None) -> str:
        """Determina a fase alimentar do bebe."""

        idade = self.idade_em_meses(referencia)
        if 6 <= idade <= 8:
            return "inicio"
        if 8 < idade <= 9:
            return "intermediario"
        if 9 < idade < 12:
            return "avancado"
        if idade > 12:
            return "familia"
        return "antes_da_introducao"

    @staticmethod
    def _get(data: Any, field_name: str, default: Any = None) -> Any:
        """Extrai campos de qualquer fonte sem acoplamento."""

        if isinstance(data, dict):
            return data.get(field_name, default)
        return getattr(data, field_name, default)

    def aplicar_atualizacao_from_any(self, data: Any) -> None:
        """Aplica atualizacao a partir de dict, DTO ou objeto simples."""

        payload = data if isinstance(data, dict) else getattr(data, "model_dump", lambda **_: {})(
            exclude_unset=True
        )
        for key, value in payload.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)

        self.updated_at = datetime.now(UTC)
