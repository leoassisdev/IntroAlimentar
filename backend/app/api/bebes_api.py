"""API HTTP do modulo de bebes."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.data.repositories.bebe_repository import BebeRepository
from app.mappers.bebe_mapper import BebeMapper
from app.schemas.bebes.requests import CreateBebeRequest, UpdateBebeRequest
from app.schemas.bebes.responses import BebeDisplayResponse, BebeResponse
from app.services.bebe_service import BebeService

router = APIRouter(prefix="/api/bebes", tags=["bebes"])


def get_service(db: Session = Depends(get_db)) -> BebeService:
    return BebeService(repo=BebeRepository(db))


@router.post("", response_model=BebeResponse, status_code=201)
def create(dto: CreateBebeRequest, service: BebeService = Depends(get_service)) -> BebeResponse:
    try:
        entity = service.create(dto)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return BebeMapper.to_public(entity)


@router.get("", response_model=list[BebeResponse])
def list_all(service: BebeService = Depends(get_service)) -> list[BebeResponse]:
    entities = service.list()
    return [BebeMapper.to_public(entity) for entity in entities]


@router.get("/{bebe_id}", response_model=BebeResponse)
def get(bebe_id: str, service: BebeService = Depends(get_service)) -> BebeResponse:
    entity = service.get(bebe_id)
    if entity is None:
        raise HTTPException(status_code=404, detail="Bebe nao encontrado.")
    return BebeMapper.to_public(entity)


@router.get("/{bebe_id}/display", response_model=BebeDisplayResponse)
def display(bebe_id: str, service: BebeService = Depends(get_service)) -> BebeDisplayResponse:
    entity = service.get(bebe_id)
    if entity is None:
        raise HTTPException(status_code=404, detail="Bebe nao encontrado.")
    return BebeMapper.to_display(entity)


@router.put("/{bebe_id}", response_model=BebeResponse)
def update(bebe_id: str, dto: UpdateBebeRequest, service: BebeService = Depends(get_service)) -> BebeResponse:
    try:
        entity = service.update(bebe_id, dto)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return BebeMapper.to_public(entity)


@router.delete("/{bebe_id}")
def delete(bebe_id: str, service: BebeService = Depends(get_service)) -> dict[str, str]:
    service.delete(bebe_id)
    return {"message": "Deletado com sucesso"}
