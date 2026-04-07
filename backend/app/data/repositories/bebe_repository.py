"""Repositorio de bebes."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.data.models.bebe_model import BebeModel
from app.domain.bebes.bebe_entity import Bebe


class BebeRepository:
    """Repositorio da entidade Bebe."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, bebe: Bebe) -> Bebe:
        model = self._to_model(bebe)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def list(self, offset: int, limit: int) -> tuple[list[Bebe], int]:
        total = self.db.scalar(select(func.count()).select_from(BebeModel)) or 0
        models = self.db.scalars(
            select(BebeModel).order_by(BebeModel.created_at.desc()).offset(offset).limit(limit)
        ).all()
        return [self._to_entity(model) for model in models], total

    def get_by_id(self, bebe_id: str) -> Bebe | None:
        model = self.db.get(BebeModel, bebe_id)
        if not model:
            return None
        return self._to_entity(model)

    def update(self, bebe: Bebe) -> Bebe:
        model = self.db.get(BebeModel, bebe.id)
        if model is None:
            raise ValueError("Bebe nao encontrado para atualizacao.")

        updated_model = self._to_model(bebe)
        for field in (
            "nome",
            "data_nascimento",
            "genero",
            "foto",
            "ativo",
            "created_at",
            "updated_at",
        ):
            setattr(model, field, getattr(updated_model, field))

        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def soft_delete(self, bebe_id: str) -> Bebe | None:
        model = self.db.get(BebeModel, bebe_id)
        if model is None:
            return None
        model.ativo = False
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def _to_entity(self, model: BebeModel) -> Bebe:
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
