from typing import Optional

from sqlalchemy.orm import Session

from app.domain.bebes.bebe_entity import Bebe
from app.data.models.bebe_model import BebeModel


class BebeRepository:
    """Repositório para persistência de Bebe — apenas CRUD/queries."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def save(self, bebe: Bebe) -> Bebe:
        """Persiste um novo bebê."""
        model = self._to_model(bebe)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def get_by_id(self, bebe_id: str) -> Optional[Bebe]:
        """Busca bebê por ID."""
        model = self.db.query(BebeModel).filter_by(id=bebe_id).first()
        return self._to_entity(model) if model else None

    def list_all(self) -> list[Bebe]:
        """Lista todos os bebês ativos."""
        models = self.db.query(BebeModel).filter_by(ativo=True).all()
        return [self._to_entity(m) for m in models]

    def update(self, bebe: Bebe) -> Optional[Bebe]:
        """Atualiza um bebê existente."""
        model = self.db.query(BebeModel).filter_by(id=bebe.id).first()
        if not model:
            return None

        for attr, value in bebe.__dict__.items():
            setattr(model, attr, value)

        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def soft_delete(self, bebe_id: str) -> None:
        """Soft delete — marca como inativo."""
        model = self.db.query(BebeModel).filter_by(id=bebe_id).first()
        if model:
            model.ativo = False
            self.db.commit()

    def _to_entity(self, model: BebeModel) -> Bebe:
        """Converte modelo SQLAlchemy para entidade de domínio."""
        return Bebe(
            id=model.id,
            nome=model.nome,
            data_nascimento=model.data_nascimento,
            genero=model.genero,
            foto=model.foto,
            ativo=model.ativo,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )

    def _to_model(self, entity: Bebe) -> BebeModel:
        """Converte entidade de domínio para modelo SQLAlchemy."""
        return BebeModel(
            id=entity.id,
            nome=entity.nome,
            data_nascimento=entity.data_nascimento,
            genero=entity.genero,
            foto=entity.foto,
            ativo=entity.ativo,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )
