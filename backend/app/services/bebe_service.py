from typing import Any, Optional

from app.domain.bebes.bebe_entity import Bebe
from app.domain.bebes.bebe_factory import BebeFactory
from app.data.repositories.bebe_repository import BebeRepository


class BebeService:
    """Orquestra operações de Bebe — sem acessar campos do DTO diretamente."""

    def __init__(self, repo: BebeRepository) -> None:
        self.repo = repo

    def create(self, dto: Any) -> Bebe:
        """Cria um novo bebê via Factory."""
        bebe = BebeFactory.make_bebe(dto)
        return self.repo.save(bebe)

    def get(self, bebe_id: str) -> Optional[Bebe]:
        """Busca bebê por ID."""
        return self.repo.get_by_id(bebe_id)

    def list(self) -> list[Bebe]:
        """Lista todos os bebês ativos."""
        return self.repo.list_all()

    def update(self, bebe_id: str, dto: Any) -> Bebe:
        """Atualiza um bebê existente."""
        bebe = self.repo.get_by_id(bebe_id)
        if not bebe:
            raise ValueError("Bebê não encontrado")

        bebe.aplicar_atualizacao_from_any(dto.dict(exclude_unset=True))
        return self.repo.update(bebe)

    def delete(self, bebe_id: str) -> None:
        """Soft delete de um bebê."""
        self.repo.soft_delete(bebe_id)
