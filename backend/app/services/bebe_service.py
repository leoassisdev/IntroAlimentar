"""Service do modulo de bebes."""

from __future__ import annotations

from app.domain.bebes.bebe_factory import BebeFactory
from app.schemas.bebes.requests import CreateBebeRequest, UpdateBebeRequest


class BebeService:
    """Orquestra operacoes de bebes sem carregar regra de negocio HTTP."""

    def __init__(self, repo) -> None:
        self.repo = repo

    def criar(self, dto: CreateBebeRequest):
        bebe = BebeFactory.make_bebe(dto)
        return self.repo.create(bebe)

    def listar(self, offset: int, limit: int):
        return self.repo.list(offset=offset, limit=limit)

    def buscar_por_id(self, bebe_id: str):
        return self.repo.get_by_id(bebe_id)

    def atualizar(self, bebe_id: str, dto: UpdateBebeRequest):
        atual = self.repo.get_by_id(bebe_id)
        if atual is None:
            return None
        atualizado = atual.aplicar_atualizacao_from_any(dto)
        return self.repo.update(atualizado)

    def deletar(self, bebe_id: str):
        return self.repo.soft_delete(bebe_id)
