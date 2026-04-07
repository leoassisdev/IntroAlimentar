"""Modelo SQLAlchemy para RegistroAlergenico."""

from sqlalchemy import Column, String, Boolean, Date, DateTime, Integer, ForeignKey, JSON
from app.config.database import Base


class AlergenicoModel(Base):
    """Tabela de registros de alergênicos."""

    __tablename__ = "registros_alergenicos"

    id = Column(String, primary_key=True, index=True)
    bebe_id = Column(String, ForeignKey("bebes.id"), nullable=False, index=True)
    nome_alimento = Column(String, nullable=False)
    numero_oferta = Column(Integer, nullable=False)
    data_oferta = Column(Date, nullable=False)
    teve_reacao = Column(Boolean, default=False)
    sintomas = Column(JSON, default=list)
    notas = Column(String, nullable=True)
    created_at = Column(DateTime)
