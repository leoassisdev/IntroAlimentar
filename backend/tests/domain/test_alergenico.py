"""Testes de domínio para RegistroAlergenico."""

from datetime import date, datetime
import pytest
from app.domain.alergenicos.alergenico_entity import RegistroAlergenico


def _make_alergenico(**kwargs) -> RegistroAlergenico:
    """Helper para criar registro alergênico com defaults."""
    defaults = dict(
        id="1",
        bebe_id="b1",
        nome_alimento="Ovos (clara e gema)",
        numero_oferta=1,
        data_oferta=date(2025, 6, 2),
        teve_reacao=False,
        sintomas=[],
        notas=None,
        created_at=datetime.utcnow(),
    )
    defaults.update(kwargs)
    return RegistroAlergenico(**defaults)


def test_alimento_invalido():
    with pytest.raises(ValueError, match="Alimento alergênico inválido"):
        _make_alergenico(nome_alimento="Chocolate")


def test_numero_oferta_invalido():
    with pytest.raises(ValueError, match="Número de oferta deve ser entre 1 e 5"):
        _make_alergenico(numero_oferta=6)


def test_reacao_sem_sintomas():
    with pytest.raises(ValueError, match="Sintomas obrigatórios"):
        _make_alergenico(teve_reacao=True, sintomas=[])


def test_reacao_com_sintomas():
    r = _make_alergenico(teve_reacao=True, sintomas=["Vômito"])
    assert r.teve_reacao is True


def test_pode_oferecer_intervalo_respeitado():
    registros = [_make_alergenico(data_oferta=date(2025, 6, 1))]
    assert RegistroAlergenico.pode_oferecer(registros, "Ovos (clara e gema)", date(2025, 6, 5)) is True


def test_nao_pode_oferecer_intervalo_curto():
    registros = [_make_alergenico(data_oferta=date(2025, 6, 4))]
    assert RegistroAlergenico.pode_oferecer(registros, "Ovos (clara e gema)", date(2025, 6, 5)) is False


def test_nao_pode_oferecer_max_5():
    registros = [
        _make_alergenico(numero_oferta=i, data_oferta=date(2025, 5, 1 + i * 4))
        for i in range(1, 6)
    ]
    assert RegistroAlergenico.pode_oferecer(registros, "Ovos (clara e gema)", date(2025, 7, 1)) is False


def test_total_ofertas():
    registros = [_make_alergenico(), _make_alergenico(), _make_alergenico()]
    assert RegistroAlergenico.total_ofertas(registros, "Ovos (clara e gema)") == 3
