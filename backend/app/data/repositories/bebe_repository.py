"""Repositorio de bebes."""

from __future__ import annotations

from sqlalchemy.orm import Session

from app.data.models.bebe_model import BebeModel
from app.domain.bebes.bebe_entity import Bebe


class BebeRepository:
    """Repositorio da entidade Bebe."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def save(self, bebe: Bebe) -> Bebe:
        model = self._to_model(bebe)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def list_all(self) -> list[Bebe]:
        models = self.db.query(BebeModel).filter_by(ativo=True).all()
        return [self._to_entity(model) for model in models]

    def get_by_id(self, bebe_id: str) -> Bebe | None:
        model = self.db.get(BebeModel, bebe_id)
        if not model:
            return None
        return self._to_entity(model)

    def update(self, bebe: Bebe) -> Bebe:
        model = self.db.query(BebeModel).filter_by(id=bebe.id).first()
        if model is None:
            return None

        for attr, value in bebe.__dict__.items():
            setattr(model, attr, value)

        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def soft_delete(self, bebe_id: str) -> None:
        model = self.db.query(BebeModel).filter_by(id=bebe_id).first()
        if model:
            model.ativo = False
            self.db.commit()

    def _to_entity(self, model: BebeModel) -> Bebe:
        payload = {
            key: value
            for key, value in model.__dict__.items()
            if not key.startswith("_")
        }
        return Bebe(**payload)

    def _to_model(self, bebe: Bebe) -> BebeModel:
        return BebeModel(
            id=bebe.id,
            nome=bebe.nome,
            data_nascimento=bebe.data_nascimento,
            genero=bebe.genero,
            foto=bebe.foto,
            ativo=bebe.ativo,
            created_at=bebe.created_at,
            updated_at=bebe.updated_at,
        )
