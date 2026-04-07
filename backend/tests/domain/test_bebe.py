from datetime import date, datetime

import pytest

from app.domain.bebes.bebe_entity import Bebe


def _make_bebe(**overrides) -> Bebe:
    defaults = dict(
        id="1",
        nome="Maria",
        data_nascimento=date(2024, 1, 1),
        genero="feminino",
        foto=None,
        ativo=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    defaults.update(overrides)
    return Bebe(**defaults)


def test_nome_invalido():
    with pytest.raises(ValueError, match="pelo menos 2 caracteres"):
        _make_bebe(nome="A")


def test_data_nascimento_futura():
    with pytest.raises(ValueError, match="não pode ser futura"):
        _make_bebe(data_nascimento=date(2099, 1, 1))


def test_idade_em_meses():
    bebe = _make_bebe(data_nascimento=date(2024, 1, 1))
    assert bebe.idade_em_meses() >= 0


def test_fase_alimentar():
    bebe = _make_bebe(data_nascimento=date(2024, 1, 1))
    assert bebe.fase_alimentar() in [
        "antes_da_introducao", "inicio", "intermediario", "avancado", "familia"
    ]


def test_aplicar_atualizacao():
    bebe = _make_bebe()
    bebe.aplicar_atualizacao_from_any({"nome": "Ana Clara"})
    assert bebe.nome == "Ana Clara"
