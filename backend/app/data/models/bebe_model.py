from sqlalchemy import Column, String, Boolean, Date, DateTime

from app.config.database import Base


class BebeModel(Base):
    """Modelo SQLAlchemy para a tabela bebes."""

    __tablename__ = "bebes"

    id = Column(String, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    data_nascimento = Column(Date, nullable=False)
    genero = Column(String, nullable=False)
    foto = Column(String, nullable=True)
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
