from datetime import date

from app.domain.bebes.bebe_entity import Bebe


def test_bebe_calcula_idade_e_fase() -> None:
    bebe = Bebe(
        id="1",
        nome="Lia",
        data_nascimento=date(2024, 7, 1),
        genero="feminino",
        foto=None,
        ativo=True,
        created_at=date.today(),
        updated_at=date.today(),
    )

    assert bebe.idade_em_meses(date(2025, 2, 1)) == 7
    assert bebe.fase_alimentar(date(2025, 2, 1)) == "inicio"
