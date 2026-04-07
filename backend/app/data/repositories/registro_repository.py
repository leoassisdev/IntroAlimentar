"""Repositório para RegistroAlimentar — apenas CRUD/queries."""

from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.domain.registros.registro_entity import RegistroAlimentar
from app.data.models.registro_model import RegistroModel


class RegistroRepository:
    """Repositório de persistência para registros alimentares."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def save(self, registro: RegistroAlimentar) -> RegistroAlimentar:
        """Persiste um novo registro."""
        model = self._to_model(registro)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def get_by_id(self, registro_id: str) -> RegistroAlimentar | None:
        """Busca registro por ID."""
        model = self.db.query(RegistroModel).filter_by(id=registro_id).first()
        return self._to_entity(model) if model else None

    def list_by_bebe(self, bebe_id: str) -> list[RegistroAlimentar]:
        """Lista todos os registros de um bebê."""
        models = self.db.query(RegistroModel).filter_by(bebe_id=bebe_id).order_by(RegistroModel.data.desc()).all()
        return [self._to_entity(m) for m in models]

    def list_by_data(self, bebe_id: str, data: date) -> list[RegistroAlimentar]:
        """Lista registros de um bebê em uma data específica."""
        models = self.db.query(RegistroModel).filter_by(bebe_id=bebe_id, data=data).all()
        return [self._to_entity(m) for m in models]

    def list_by_semana(self, bebe_id: str, semana_inicio: date, semana_fim: date) -> list[RegistroAlimentar]:
        """Lista registros de uma semana."""
        models = self.db.query(RegistroModel).filter(
            RegistroModel.bebe_id == bebe_id,
            RegistroModel.data >= semana_inicio,
            RegistroModel.data <= semana_fim,
        ).order_by(RegistroModel.data).all()
        return [self._to_entity(m) for m in models]

    def list_semana_atual(self, bebe_id: str) -> list[RegistroAlimentar]:
        """Lista registros da semana atual."""
        hoje = date.today()
        inicio_semana = hoje - timedelta(days=hoje.weekday())
        fim_semana = inicio_semana + timedelta(days=6)
        return self.list_by_semana(bebe_id, inicio_semana, fim_semana)

    def update(self, registro: RegistroAlimentar) -> RegistroAlimentar:
        """Atualiza um registro existente."""
        model = self.db.query(RegistroModel).filter_by(id=registro.id).first()
        if not model:
            return None
        for attr, value in registro.__dict__.items():
            setattr(model, attr, value)
        self.db.commit()
        return self._to_entity(model)

    def delete(self, registro_id: str) -> None:
        """Remove um registro."""
        model = self.db.query(RegistroModel).filter_by(id=registro_id).first()
        if model:
            self.db.delete(model)
            self.db.commit()

    def _to_entity(self, model: RegistroModel) -> RegistroAlimentar:
        """Converte model para entity."""
        d = {c.name: getattr(model, c.name) for c in model.__table__.columns}
        return RegistroAlimentar(**d)

    def _to_model(self, entity: RegistroAlimentar) -> RegistroModel:
        """Converte entity para model."""
        return RegistroModel(**entity.__dict__)
