"""API de registros alimentares."""

from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.data.repositories.bebe_repository import BebeRepository
from app.data.repositories.registro_repository import RegistroAlimentarRepository
from app.mappers.registro_mapper import RegistroAlimentarMapper
from app.schemas.registros.requests import CreateRegistroRequest, UpdateRegistroRequest
from app.schemas.registros.responses import RegistroAlimentarResponse
from app.services.registro_service import RegistroAlimentarService

router = APIRouter(prefix="/api/bebes/{bebe_id}/registros", tags=["registros"])


def get_service(db: Session = Depends(get_db)) -> RegistroAlimentarService:
    return RegistroAlimentarService(
        repo=RegistroAlimentarRepository(db),
        bebe_repo=BebeRepository(db),
    )


@router.post("", response_model=RegistroAlimentarResponse, status_code=201)
def create(
    bebe_id: str,
    dto: CreateRegistroRequest,
    service: RegistroAlimentarService = Depends(get_service),
) -> RegistroAlimentarResponse:
    try:
        entity = service.create(bebe_id, dto)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return RegistroAlimentarMapper.to_public(entity)


@router.get("", response_model=list[RegistroAlimentarResponse])
def list_all(
    bebe_id: str,
    data: date | None = None,
    categoria: str | None = None,
    semana_atual: bool = False,
    service: RegistroAlimentarService = Depends(get_service),
) -> list[RegistroAlimentarResponse]:
    return [
        RegistroAlimentarMapper.to_public(item)
        for item in service.list_filtered(
            bebe_id,
            target_date=data,
            categoria=categoria,
            semana_atual=semana_atual,
        )
    ]


@router.get("/semana-atual", response_model=list[RegistroAlimentarResponse])
def semana_atual(
    bebe_id: str,
    service: RegistroAlimentarService = Depends(get_service),
) -> list[RegistroAlimentarResponse]:
    return [RegistroAlimentarMapper.to_public(item) for item in service.alimentos_semana_atual(bebe_id)]


@router.get("/{registro_id}", response_model=RegistroAlimentarResponse)
def get(
    bebe_id: str,
    registro_id: str,
    service: RegistroAlimentarService = Depends(get_service),
) -> RegistroAlimentarResponse:
    entity = service.get(bebe_id, registro_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Registro não encontrado.")
    return RegistroAlimentarMapper.to_public(entity)


@router.put("/{registro_id}", response_model=RegistroAlimentarResponse)
def update(
    bebe_id: str,
    registro_id: str,
    dto: UpdateRegistroRequest,
    service: RegistroAlimentarService = Depends(get_service),
) -> RegistroAlimentarResponse:
    try:
        entity = service.update(bebe_id, registro_id, dto)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return RegistroAlimentarMapper.to_public(entity)


@router.delete("/{registro_id}")
def delete(
    bebe_id: str,
    registro_id: str,
    service: RegistroAlimentarService = Depends(get_service),
) -> dict[str, str]:
    try:
        service.delete(bebe_id, registro_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return {"message": "Registro deletado com sucesso"}
