from datetime import UTC, date, datetime

import pytest

from app.domain.registros.registro_entity import RegistroAlimentar


def test_aceitacao_invalida() -> None:
    with pytest.raises(ValueError):
        RegistroAlimentar(
            id="1",
            bebe_id="b1",
            data=date(2025, 1, 10),
            tipo_refeicao="almoco",
            categoria="frutas",
            nome_alimento="Banana",
            tipo_corte=None,
            aceitacao=6,
            notas=None,
            quantidade=None,
            unidade=None,
            alimento_alergenico=False,
            created_at=datetime.now(UTC),
        )
