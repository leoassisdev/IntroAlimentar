"""Repositorio de registros alimentares."""

from sqlalchemy.orm import Session

from app.data.models.registro_model import RegistroAlimentarModel
from app.domain.registros.registro_entity import RegistroAlimentar


class RegistroAlimentarRepository:
    """Repositorio sem regra de negocio para registros."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def save(self, registro: RegistroAlimentar) -> RegistroAlimentar:
        model = self._to_model(registro)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def get_by_id(self, registro_id: str) -> RegistroAlimentar | None:
        model = self.db.query(RegistroAlimentarModel).filter_by(id=registro_id).first()
        return self._to_entity(model) if model else None

    def list_by_bebe(self, bebe_id: str) -> list[RegistroAlimentar]:
        models = (
            self.db.query(RegistroAlimentarModel)
            .filter_by(bebe_id=bebe_id)
            .order_by(RegistroAlimentarModel.data.desc(), RegistroAlimentarModel.created_at.desc())
            .all()
        )
        return [self._to_entity(model) for model in models]

    def list_by_week(self, bebe_id: str, year: int, week: int) -> list[RegistroAlimentar]:
        registros = self.list_by_bebe(bebe_id)
        return [
          registro for registro in registros
          if registro.data.isocalendar().year == year and registro.data.isocalendar().week == week
        ]

    def update(self, registro: RegistroAlimentar) -> RegistroAlimentar | None:
        model = self.db.query(RegistroAlimentarModel).filter_by(id=registro.id).first()
        if not model:
            return None
        for attr, value in registro.__dict__.items():
            setattr(model, attr, value)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def delete(self, registro_id: str) -> None:
        model = self.db.query(RegistroAlimentarModel).filter_by(id=registro_id).first()
        if model:
            self.db.delete(model)
            self.db.commit()

    def _to_entity(self, model: RegistroAlimentarModel) -> RegistroAlimentar:
        payload = {key: value for key, value in model.__dict__.items() if not key.startswith("_")}
        return RegistroAlimentar(**payload)

    def _to_model(self, entity: RegistroAlimentar) -> RegistroAlimentarModel:
        return RegistroAlimentarModel(**entity.__dict__)
