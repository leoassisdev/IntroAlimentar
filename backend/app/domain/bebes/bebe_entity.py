from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional


@dataclass
class Bebe:
    """Entidade de domínio representando um bebê em introdução alimentar."""

    id: str
    nome: str
    data_nascimento: date
    genero: str
    foto: Optional[str]
    ativo: bool
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        if len(self.nome) < 2:
            raise ValueError("Nome deve ter pelo menos 2 caracteres")

        if self.data_nascimento > date.today():
            raise ValueError("Data de nascimento não pode ser futura")

    def idade_em_meses(self) -> int:
        """Calcula a idade do bebê em meses."""
        today = date.today()
        return (today.year - self.data_nascimento.year) * 12 + (
            today.month - self.data_nascimento.month
        )

    def fase_alimentar(self) -> str:
        """Retorna a fase alimentar baseada na idade em meses."""
        idade = self.idade_em_meses()

        if 6 <= idade <= 8:
            return "inicio"
        elif 8 < idade <= 9:
            return "intermediario"
        elif 9 < idade <= 12:
            return "avancado"
        elif idade > 12:
            return "familia"
        return "antes_da_introducao"

    def aplicar_atualizacao_from_any(self, data: dict) -> None:
        """Aplica atualização parcial a partir de um dicionário."""
        for key, value in data.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)

        self.updated_at = datetime.utcnow()
