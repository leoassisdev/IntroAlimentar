"""Entidade principal do modulo de bebes."""

from __future__ import annotations

from dataclasses import dataclass, replace
from datetime import UTC, date, datetime
from typing import Any


VALID_GENEROS = {"masculino", "feminino", "outro"}


@dataclass(frozen=True)
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

        base = referencia or date.today()
        if self.data_nascimento > base:
            return 0

        anos = base.year - self.data_nascimento.year
        meses = base.month - self.data_nascimento.month
        total = anos * 12 + meses

        if base.day < self.data_nascimento.day:
            total -= 1

        return max(total, 0)

    def fase_alimentar(self, referencia: date | None = None) -> str:
        """Determina a fase alimentar do bebe."""

        idade = self.idade_em_meses(referencia)
        if 6 <= idade <= 8:
            return "inicio"
        if 8 < idade <= 9:
            return "intermediario"
        if 9 < idade < 12:
            return "avancado"
        if idade >= 12:
            return "familia"
        return "pre-introducao"

    @staticmethod
    def _get(data: Any, field_name: str, default: Any = None) -> Any:
        """Extrai campos de qualquer fonte sem acoplamento."""

        if isinstance(data, dict):
            return data.get(field_name, default)
        return getattr(data, field_name, default)

    def aplicar_atualizacao_from_any(self, data: Any) -> "Bebe":
        """Aplica atualizacao a partir de dict, DTO ou objeto simples."""

        agora = datetime.now(UTC)
        return replace(
            self,
            nome=self._get(data, "nome", self.nome),
            data_nascimento=self._get(data, "data_nascimento", self.data_nascimento),
            genero=self._get(data, "genero", self.genero),
            foto=self._get(data, "foto", self.foto),
            ativo=self._get(data, "ativo", self.ativo),
            updated_at=agora,
        )
