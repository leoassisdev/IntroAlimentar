"""Testes de domínio para RegistroAlimentar."""

from datetime import date, datetime
import pytest
from app.domain.registros.registro_entity import RegistroAlimentar


def _make_registro(**kwargs) -> RegistroAlimentar:
    """Helper para criar registro com defaults."""
    defaults = dict(
        id="1",
        bebe_id="b1",
        data=date(2025, 6, 2),
        tipo_refeicao="almoco",
        categoria="frutas",
        nome_alimento="Banana",
        tipo_corte="Palito",
        aceitacao=4,
        notas=None,
        quantidade=None,
        unidade=None,
        alimento_alergenico=False,
        created_at=datetime.utcnow(),
    )
    defaults.update(kwargs)
    return RegistroAlimentar(**defaults)


def test_tipo_refeicao_invalido():
    with pytest.raises(ValueError, match="Tipo de refeição inválido"):
        _make_registro(tipo_refeicao="brunch")


def test_categoria_invalida():
    with pytest.raises(ValueError, match="Categoria inválida"):
        _make_registro(categoria="doces")


def test_aceitacao_fora_range():
    with pytest.raises(ValueError, match="Aceitação deve ser entre 1 e 5"):
        _make_registro(aceitacao=6)


def test_aceitacao_null_aceita():
    r = _make_registro(aceitacao=None)
    assert r.aceitacao is None


def test_mesma_semana():
    r1 = _make_registro(data=date(2025, 6, 2))  # segunda
    r2 = _make_registro(data=date(2025, 6, 5))  # quinta
    assert r1.esta_na_mesma_semana(r2) is True


def test_regra_dos_3():
    registros = [
        _make_registro(nome_alimento="Banana"),
        _make_registro(nome_alimento="Banana"),
        _make_registro(nome_alimento="Banana"),
    ]
    r = _make_registro(nome_alimento="Banana")
    assert r.pertence_a_regra_dos_3(registros) is True
