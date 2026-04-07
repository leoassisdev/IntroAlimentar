"""Model ORM para registros alimentares."""

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.config.database import Base


class RegistroAlimentarModel(Base):
    """Persistencia de registros alimentares."""

    __tablename__ = "registros_alimentares"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, index=True)
    bebe_id: Mapped[str] = mapped_column(String(36), ForeignKey("bebes.id"), index=True, nullable=False)
    data: Mapped[Date] = mapped_column(Date, nullable=False, index=True)
    tipo_refeicao: Mapped[str] = mapped_column(String(30), nullable=False)
    categoria: Mapped[str] = mapped_column(String(40), nullable=False)
    nome_alimento: Mapped[str] = mapped_column(String(120), nullable=False)
    tipo_corte: Mapped[str | None] = mapped_column(String(120), nullable=True)
    aceitacao: Mapped[int | None] = mapped_column(Integer, nullable=True)
    notas: Mapped[str | None] = mapped_column(String(500), nullable=True)
    quantidade: Mapped[float | None] = mapped_column(Float, nullable=True)
    unidade: Mapped[str | None] = mapped_column(String(20), nullable=True)
    alimento_alergenico: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
