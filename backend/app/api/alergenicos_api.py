"""API de alergênicos — sem regra de negócio."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.alergenicos.requests import CreateAlergenicoRequest
from app.schemas.alergenicos.responses import AlergenicoResponse, PodeOferecerResponse
from app.services.alergenico_service import AlergenicoService
from app.mappers.alergenico_mapper import AlergenicoMapper
from app.data.repositories.alergenico_repository import AlergenicoRepository
from app.config.database import get_db

router = APIRouter(prefix="/api/bebes/{bebe_id}/alergenicos", tags=["Alergênicos"])


def get_service(db: Session = Depends(get_db)) -> AlergenicoService:
    """Injeta serviço com repositório."""
    return AlergenicoService(AlergenicoRepository(db))


@router.post("", response_model=AlergenicoResponse)
def create(
    bebe_id: str,
    dto: CreateAlergenicoRequest,
    service: AlergenicoService = Depends(get_service),
):
    """Registra uma oferta de alimento alergênico."""
    dto.bebe_id = bebe_id
    try:
        entity = service.create(dto)
        return AlergenicoMapper.to_public(entity)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("", response_model=list[AlergenicoResponse])
def list_all(
    bebe_id: str,
    service: AlergenicoService = Depends(get_service),
):
    """Lista todos os registros de alergênicos de um bebê."""
    entities = service.list_by_bebe(bebe_id)
    return [AlergenicoMapper.to_public(e) for e in entities]


@router.get("/{alimento}/pode-oferecer", response_model=PodeOferecerResponse)
def pode_oferecer(
    bebe_id: str,
    alimento: str,
    service: AlergenicoService = Depends(get_service),
):
    """Verifica se um alimento alergênico pode ser oferecido."""
    result = service.verificar_disponibilidade(bebe_id, alimento)
    return AlergenicoMapper.to_pode_oferecer(result)
