"""API de relatórios semanais — sem regra de negócio."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.schemas.relatorios.responses import RelatorioResponse
from app.services.relatorio_service import RelatorioService
from app.mappers.relatorio_mapper import RelatorioMapper
from app.data.repositories.registro_repository import RegistroRepository
from app.config.database import get_db

router = APIRouter(prefix="/api/bebes/{bebe_id}/relatorios", tags=["Relatórios"])


def get_service(db: Session = Depends(get_db)) -> RelatorioService:
    """Injeta serviço com repositório de registros."""
    return RelatorioService(RegistroRepository(db))


@router.get("/semanal", response_model=RelatorioResponse)
def relatorio_semanal(
    bebe_id: str,
    offset: int = Query(0, ge=0, description="0=semana atual, 1=semana anterior, etc."),
    service: RelatorioService = Depends(get_service),
):
    """Gera relatório semanal do bebê."""
    entity = service.gerar_relatorio(bebe_id, offset)
    return RelatorioMapper.to_public(entity)
