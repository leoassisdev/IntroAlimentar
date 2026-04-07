"""Model ORM para bebes."""

from sqlalchemy import Boolean, Date, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column

from app.config.database import Base


class BebeModel(Base):
    """Persistencia do bebe em banco."""

    __tablename__ = "bebes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(100), nullable=False)
    data_nascimento: Mapped[Date] = mapped_column(Date, nullable=False)
    genero: Mapped[str] = mapped_column(String(20), nullable=False)
    foto: Mapped[str | None] = mapped_column(String, nullable=True)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
