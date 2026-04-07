"""Modelo SQLAlchemy para RegistroAlimentar."""

from sqlalchemy import Column, String, Boolean, Date, DateTime, Integer, Float, ForeignKey
from app.config.database import Base


class RegistroModel(Base):
    """Tabela de registros alimentares."""

    __tablename__ = "registros_alimentares"

    id = Column(String, primary_key=True, index=True)
    bebe_id = Column(String, ForeignKey("bebes.id"), nullable=False, index=True)
    data = Column(Date, nullable=False)
    tipo_refeicao = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    nome_alimento = Column(String, nullable=False)
    tipo_corte = Column(String, nullable=True)
    aceitacao = Column(Integer, nullable=True)
    notas = Column(String, nullable=True)
    quantidade = Column(Float, nullable=True)
    unidade = Column(String, nullable=True)
    alimento_alergenico = Column(Boolean, default=False)
    created_at = Column(DateTime)
