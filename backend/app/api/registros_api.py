"""API de registros alimentares — sem regra de negócio."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import date
from typing import Optional

from app.schemas.registros.requests import CreateRegistroRequest, UpdateRegistroRequest
from app.schemas.registros.responses import RegistroResponse, SemanaAtualResponse
from app.services.registro_service import RegistroService
from app.mappers.registro_mapper import RegistroMapper
from app.data.repositories.registro_repository import RegistroRepository
from app.config.database import get_db

router = APIRouter(prefix="/api/bebes/{bebe_id}/registros", tags=["Registros"])


def get_service(db: Session = Depends(get_db)) -> RegistroService:
    """Injeta serviço com repositório."""
    return RegistroService(RegistroRepository(db))


@router.post("", response_model=RegistroResponse)
def create(
    bebe_id: str,
    dto: CreateRegistroRequest,
    service: RegistroService = Depends(get_service),
):
    """Cria um novo registro alimentar."""
    dto.bebe_id = bebe_id
    entity = service.create(dto)
    return RegistroMapper.to_public(entity)


@router.get("", response_model=list[RegistroResponse])
def list_registros(
    bebe_id: str,
    data: Optional[date] = Query(None),
    service: RegistroService = Depends(get_service),
):
    """Lista registros de um bebê, com filtro opcional por data."""
    if data:
        entities = service.list_by_data(bebe_id, data)
    else:
        entities = service.list_by_bebe(bebe_id)
    return [RegistroMapper.to_public(e) for e in entities]


@router.get("/semana-atual", response_model=list[SemanaAtualResponse])
def semana_atual(
    bebe_id: str,
    service: RegistroService = Depends(get_service),
):
    """Retorna alimentos usados na semana atual (Regra dos 3)."""
    por_categoria = service.alimentos_semana_por_categoria(bebe_id)
    return [
        RegistroMapper.to_semana_atual(cat, alimentos)
        for cat, alimentos in por_categoria.items()
    ]


@router.get("/{registro_id}", response_model=RegistroResponse)
def get(
    bebe_id: str,
    registro_id: str,
    service: RegistroService = Depends(get_service),
):
    """Busca registro por ID."""
    entity = service.get(registro_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Registro não encontrado")
    return RegistroMapper.to_public(entity)


@router.put("/{registro_id}", response_model=RegistroResponse)
def update(
    bebe_id: str,
    registro_id: str,
    dto: UpdateRegistroRequest,
    service: RegistroService = Depends(get_service),
):
    """Atualiza registro existente."""
    try:
        entity = service.update(registro_id, dto)
        return RegistroMapper.to_public(entity)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{registro_id}")
def delete(
    bebe_id: str,
    registro_id: str,
    service: RegistroService = Depends(get_service),
):
    """Remove um registro."""
    service.delete(registro_id)
    return {"message": "Registro deletado com sucesso"}
