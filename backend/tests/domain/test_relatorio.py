"""Testes de domínio para RelatorioSemanal."""

from datetime import date, datetime
import pytest
from app.domain.relatorios.relatorio_entity import RelatorioSemanal
from app.domain.registros.registro_entity import RegistroAlimentar


def _make_registro(categoria: str = "frutas", nome: str = "Banana", aceitacao: int = 4) -> RegistroAlimentar:
    return RegistroAlimentar(
        id="1", bebe_id="b1", data=date(2025, 6, 2),
        tipo_refeicao="almoco", categoria=categoria,
        nome_alimento=nome, tipo_corte=None, aceitacao=aceitacao,
        notas=None, quantidade=None, unidade=None,
        alimento_alergenico=False, created_at=datetime.utcnow(),
    )


def _make_relatorio(registros: list) -> RelatorioSemanal:
    r = RelatorioSemanal(
        id="r1", bebe_id="b1",
        semana_inicio=date(2025, 6, 2), semana_fim=date(2025, 6, 8),
        total_frutas=0, total_legumes=0, total_proteinas=0,
        total_cereais=0, total_leguminosas=0, total_folhosos=0,
        total_agua_ml=0, total_leite=0, media_aceitacao=0,
        alimentos_unicos=0, registros=registros, observacoes=[],
        generated_at=datetime.utcnow(),
    )
    return r


def test_alimentos_baixa_aceitacao():
    registros = [_make_registro(aceitacao=1), _make_registro(aceitacao=5, nome="Manga")]
    rel = _make_relatorio(registros)
    assert "Banana" in rel.alimentos_baixa_aceitacao()
    assert "Manga" not in rel.alimentos_baixa_aceitacao()


def test_regra_dos_3_nao_seguida():
    registros = [_make_registro(categoria="frutas", nome="Banana")]
    rel = _make_relatorio(registros)
    result = rel.regra_dos_3_seguida()
    assert result["frutas"] is False


def test_regra_dos_3_seguida():
    registros = [
        _make_registro(categoria="frutas", nome="Banana"),
        _make_registro(categoria="frutas", nome="Manga"),
        _make_registro(categoria="frutas", nome="Mamão"),
    ]
    rel = _make_relatorio(registros)
    result = rel.regra_dos_3_seguida()
    assert result["frutas"] is True
