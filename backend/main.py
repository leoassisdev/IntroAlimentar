"""Ponto de entrada da API do IntroAlimentar."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.bebes_api import router as bebes_router
from app.api.registros_api import router as registros_router
from app.config.database import Base, engine
from app.config.settings import get_settings

settings = get_settings()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="IntroAlimentar API",
    version="0.1.0",
    description="API local do IntroAlimentar para acompanhamento da introducao alimentar.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(bebes_router)
app.include_router(registros_router)


@app.get("/")
def root() -> dict[str, str]:
    """Retorna uma mensagem simples na raiz da API."""

    return {
        "app": "IntroAlimentar API",
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health")
def health() -> dict[str, str]:
    """Retorna o estado simples da aplicacao."""

    return {"status": "ok"}
