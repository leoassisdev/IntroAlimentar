from datetime import date

from app.schemas.registros.requests import CreateRegistroRequest
from app.services.registro_service import RegistroAlimentarService


class BebeRepoStub:
    def get_by_id(self, bebe_id: str):
        class Bebe:
            ativo = True

        return Bebe()


class RegistroRepoStub:
    def __init__(self) -> None:
        self.items = []

    def save(self, registro):
        self.items.append(registro)
        return registro


def test_cria_registro() -> None:
    service = RegistroAlimentarService(RegistroRepoStub(), BebeRepoStub())
    registro = service.create(
        "b1",
        CreateRegistroRequest(
            data=date(2025, 1, 10),
            tipo_refeicao="almoco",
            categoria="frutas",
            nome_alimento="Banana",
            tipo_corte="Palito",
            aceitacao=4,
            notas=None,
            quantidade=None,
            unidade=None,
            alimento_alergenico=False,
        ),
    )
    assert registro.nome_alimento == "Banana"
