"""API de alimentos (referência) — base de dados da nutricionista."""

from fastapi import APIRouter, HTTPException
from app.data.seeds.food_database_seed import FOOD_DATABASE, ALIMENTOS_ALERGENICOS

router = APIRouter(prefix="/api/alimentos", tags=["Alimentos"])


@router.get("")
def list_all():
    """Retorna base completa de alimentos."""
    return FOOD_DATABASE


@router.get("/alergenicos")
def list_alergenicos():
    """Retorna lista de alimentos alergênicos."""
    return {"alimentos": ALIMENTOS_ALERGENICOS}


@router.get("/{categoria}")
def list_by_categoria(categoria: str):
    """Retorna alimentos de uma categoria específica."""
    if categoria not in FOOD_DATABASE:
        raise HTTPException(status_code=404, detail=f"Categoria '{categoria}' não encontrada")
    return {categoria: FOOD_DATABASE[categoria]}
