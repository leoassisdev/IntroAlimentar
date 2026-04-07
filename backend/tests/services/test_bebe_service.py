from datetime import date

from app.schemas.bebes.requests import CreateBebeRequest
from app.services.bebe_service import BebeService


class InMemoryRepo:
    def __init__(self) -> None:
        self.items = []

    def create(self, bebe):
        self.items.append(bebe)
        return bebe


def test_service_cria_bebe() -> None:
    service = BebeService(repo=InMemoryRepo())
    bebe = service.criar(
        CreateBebeRequest(
            nome="Theo",
            data_nascimento=date(2024, 8, 20),
            genero="masculino",
            foto=None,
        )
    )

    assert bebe.nome == "Theo"
    assert bebe.genero == "masculino"
