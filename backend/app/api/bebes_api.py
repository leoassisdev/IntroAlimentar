from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.bebes.requests import CreateBebeRequest, UpdateBebeRequest
from app.schemas.bebes.responses import BebeResponse, BebeDisplayResponse
from app.services.bebe_service import BebeService
from app.mappers.bebe_mapper import BebeMapper
from app.data.repositories.bebe_repository import BebeRepository
from app.config.database import get_db

router = APIRouter(prefix="/api/bebes", tags=["Bebes"])


def get_service(db: Session = Depends(get_db)) -> BebeService:
    """Injeção de dependência: cria Service com Repository."""
    return BebeService(BebeRepository(db))


@router.post("", response_model=BebeResponse, status_code=201)
def create(dto: CreateBebeRequest, service: BebeService = Depends(get_service)):
    """Cadastrar bebê."""
    entity = service.create(dto)
    return BebeMapper.to_public(entity)


@router.get("", response_model=list[BebeResponse])
def list_all(service: BebeService = Depends(get_service)):
    """Listar todos os bebês ativos."""
    entities = service.list()
    return [BebeMapper.to_public(e) for e in entities]


@router.get("/{bebe_id}", response_model=BebeResponse)
def get(bebe_id: str, service: BebeService = Depends(get_service)):
    """Buscar bebê por ID."""
    entity = service.get(bebe_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Bebê não encontrado")
    return BebeMapper.to_public(entity)


@router.get("/{bebe_id}/display", response_model=BebeDisplayResponse)
def display(bebe_id: str, service: BebeService = Depends(get_service)):
    """Dados simplificados do bebê (nome + idade + fase)."""
    entity = service.get(bebe_id)
    if not entity:
        raise HTTPException(status_code=404, detail="Bebê não encontrado")
    return BebeMapper.to_display(entity)


@router.put("/{bebe_id}", response_model=BebeResponse)
def update(bebe_id: str, dto: UpdateBebeRequest, service: BebeService = Depends(get_service)):
    """Atualizar bebê."""
    try:
        entity = service.update(bebe_id, dto)
        return BebeMapper.to_public(entity)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{bebe_id}")
def delete(bebe_id: str, service: BebeService = Depends(get_service)):
    """Soft delete de bebê."""
    service.delete(bebe_id)
    return {"message": "Deletado com sucesso"}
