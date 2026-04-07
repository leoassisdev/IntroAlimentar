"""Entidade de domínio RegistroAlimentar — pura, sem dependências externas."""

from dataclasses import dataclass
from datetime import date, datetime
from typing import Optional


@dataclass
class RegistroAlimentar:
    """Registro de uma refeição/alimento oferecido ao bebê."""

    id: str
    bebe_id: str
    data: date
    tipo_refeicao: str
    categoria: str
    nome_alimento: str
    tipo_corte: Optional[str]
    aceitacao: Optional[int]
    notas: Optional[str]
    quantidade: Optional[float]
    unidade: Optional[str]
    alimento_alergenico: bool
    created_at: datetime

    TIPOS_REFEICAO = (
        "cafe_manha", "almoco", "lanche_tarde",
        "jantar", "ceia", "mamada", "agua",
    )
    CATEGORIAS = (
        "frutas", "vegetais_folhosos", "legumes",
        "proteinas", "cereais", "leguminosas", "leite", "agua",
    )
    UNIDADES = ("ml", "min", "g", "porcao")

    def __post_init__(self) -> None:
        """Validações de domínio."""
        if self.tipo_refeicao not in self.TIPOS_REFEICAO:
            raise ValueError(f"Tipo de refeição inválido: {self.tipo_refeicao}")

        if self.categoria not in self.CATEGORIAS:
            raise ValueError(f"Categoria inválida: {self.categoria}")

        if self.aceitacao is not None and not (1 <= self.aceitacao <= 5):
            raise ValueError("Aceitação deve ser entre 1 e 5")

        if self.notas and len(self.notas) > 500:
            raise ValueError("Notas devem ter no máximo 500 caracteres")

        if self.unidade and self.unidade not in self.UNIDADES:
            raise ValueError(f"Unidade inválida: {self.unidade}")

    def esta_na_mesma_semana(self, outro: "RegistroAlimentar") -> bool:
        """Verifica se dois registros estão na mesma semana ISO."""
        return self.data.isocalendar()[1] == outro.data.isocalendar()[1] and \
               self.data.isocalendar()[0] == outro.data.isocalendar()[0]

    def pertence_a_regra_dos_3(self, registros_semana: list["RegistroAlimentar"]) -> bool:
        """Verifica se este alimento já foi usado 3+ vezes na semana/categoria."""
        contagem = sum(
            1 for r in registros_semana
            if r.categoria == self.categoria and r.nome_alimento == self.nome_alimento
        )
        return contagem >= 3

    def aplicar_atualizacao_from_any(self, data: dict) -> None:
        """Aplica atualização parcial a partir de um dicionário."""
        for key, value in data.items():
            if hasattr(self, key) and value is not None:
                setattr(self, key, value)
