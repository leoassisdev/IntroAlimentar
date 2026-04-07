"""Service do modulo de bebes."""

from __future__ import annotations

from app.domain.bebes.bebe_factory import BebeFactory
from app.schemas.bebes.requests import CreateBebeRequest, UpdateBebeRequest


class BebeService:
    """Orquestra operacoes de bebes sem carregar regra de negocio HTTP."""

    def __init__(self, repo) -> None:
        self.repo = repo

    def create(self, dto: CreateBebeRequest):
        bebe = BebeFactory.make_bebe(dto)
        return self.repo.save(bebe)

    def get(self, bebe_id: str):
        return self.repo.get_by_id(bebe_id)

    def list(self):
        return self.repo.list_all()

    def update(self, bebe_id: str, dto: UpdateBebeRequest):
        bebe = self.repo.get_by_id(bebe_id)
        if not bebe:
            raise ValueError("Bebê não encontrado")

        bebe.aplicar_atualizacao_from_any(dto.model_dump(exclude_unset=True))
        return self.repo.update(bebe)

    def delete(self, bebe_id: str):
        return self.repo.soft_delete(bebe_id)
