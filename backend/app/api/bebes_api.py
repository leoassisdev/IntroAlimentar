"""API HTTP do modulo de bebes."""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.data.repositories.bebe_repository import BebeRepository
from app.mappers.bebe_mapper import BebeMapper
from app.schemas.bebes.requests import CreateBebeRequest, UpdateBebeRequest
from app.schemas.bebes.responses import BebeDisplayResponse, BebeListResponse, BebePublicResponse
from app.services.bebe_service import BebeService

router = APIRouter(prefix="/api/bebes", tags=["bebes"])


def get_service(db: Session = Depends(get_db)) -> BebeService:
    return BebeService(repo=BebeRepository(db))


@router.post("", response_model=BebePublicResponse, status_code=201)
def create_bebe(dto: CreateBebeRequest, service: BebeService = Depends(get_service)) -> BebePublicResponse:
    try:
        entity = service.criar(dto)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return BebeMapper.to_public(entity)


@router.get("", response_model=BebeListResponse)
def list_bebes(
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
    service: BebeService = Depends(get_service),
) -> BebeListResponse:
    items, total = service.listar(offset=offset, limit=limit)
    return BebeListResponse(
        items=[BebeMapper.to_public(item) for item in items],
        total=total,
        offset=offset,
        limit=limit,
    )


@router.get("/{bebe_id}", response_model=BebePublicResponse)
def get_bebe(bebe_id: str, service: BebeService = Depends(get_service)) -> BebePublicResponse:
    entity = service.buscar_por_id(bebe_id)
    if entity is None:
        raise HTTPException(status_code=404, detail="Bebe nao encontrado.")
    return BebeMapper.to_public(entity)


@router.get("/{bebe_id}/display", response_model=BebeDisplayResponse)
def get_bebe_display(bebe_id: str, service: BebeService = Depends(get_service)) -> BebeDisplayResponse:
    entity = service.buscar_por_id(bebe_id)
    if entity is None:
        raise HTTPException(status_code=404, detail="Bebe nao encontrado.")
    return BebeMapper.to_display(entity)


@router.put("/{bebe_id}", response_model=BebePublicResponse)
def update_bebe(
    bebe_id: str,
    dto: UpdateBebeRequest,
    service: BebeService = Depends(get_service),
) -> BebePublicResponse:
    try:
        entity = service.atualizar(bebe_id, dto)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    if entity is None:
        raise HTTPException(status_code=404, detail="Bebe nao encontrado.")
    return BebeMapper.to_public(entity)


@router.delete("/{bebe_id}", response_model=BebePublicResponse)
def delete_bebe(bebe_id: str, service: BebeService = Depends(get_service)) -> BebePublicResponse:
    entity = service.deletar(bebe_id)
    if entity is None:
        raise HTTPException(status_code=404, detail="Bebe nao encontrado.")
    return BebeMapper.to_public(entity)
