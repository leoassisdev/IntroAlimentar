"""Repositório para RegistroAlergenico — apenas CRUD/queries."""

from sqlalchemy.orm import Session
from app.domain.alergenicos.alergenico_entity import RegistroAlergenico
from app.data.models.alergenico_model import AlergenicoModel


class AlergenicoRepository:
    """Repositório de persistência para registros de alergênicos."""

    def __init__(self, db: Session) -> None:
        self.db = db

    def save(self, registro: RegistroAlergenico) -> RegistroAlergenico:
        """Persiste um novo registro."""
        model = self._to_model(registro)
        self.db.add(model)
        self.db.commit()
        self.db.refresh(model)
        return self._to_entity(model)

    def list_by_bebe(self, bebe_id: str) -> list[RegistroAlergenico]:
        """Lista todos os registros de alergênicos de um bebê."""
        models = self.db.query(AlergenicoModel).filter_by(bebe_id=bebe_id).order_by(AlergenicoModel.data_oferta).all()
        return [self._to_entity(m) for m in models]

    def list_by_alimento(self, bebe_id: str, alimento: str) -> list[RegistroAlergenico]:
        """Lista registros de um alimento específico."""
        models = self.db.query(AlergenicoModel).filter_by(
            bebe_id=bebe_id, nome_alimento=alimento
        ).order_by(AlergenicoModel.data_oferta).all()
        return [self._to_entity(m) for m in models]

    def _to_entity(self, model: AlergenicoModel) -> RegistroAlergenico:
        """Converte model para entity."""
        return RegistroAlergenico(
            id=model.id,
            bebe_id=model.bebe_id,
            nome_alimento=model.nome_alimento,
            numero_oferta=model.numero_oferta,
            data_oferta=model.data_oferta,
            teve_reacao=model.teve_reacao,
            sintomas=model.sintomas or [],
            notas=model.notas,
            created_at=model.created_at,
        )

    def _to_model(self, entity: RegistroAlergenico) -> AlergenicoModel:
        """Converte entity para model."""
        return AlergenicoModel(
            id=entity.id,
            bebe_id=entity.bebe_id,
            nome_alimento=entity.nome_alimento,
            numero_oferta=entity.numero_oferta,
            data_oferta=entity.data_oferta,
            teve_reacao=entity.teve_reacao,
            sintomas=entity.sintomas,
            notas=entity.notas,
            created_at=entity.created_at,
        )
