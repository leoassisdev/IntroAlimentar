"""Ponto de entrada da aplicação IntroAlimentar."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.database import engine, Base
from app.config.settings import APP_NAME, APP_VERSION, CORS_ORIGINS
from app.api.bebes_api import router as bebes_router
from app.api.registros_api import router as registros_router
from app.api.alergenicos_api import router as alergenicos_router
from app.api.relatorios_api import router as relatorios_router
from app.api.alimentos_api import router as alimentos_router

# Criar tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(title=APP_NAME, version=APP_VERSION)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(bebes_router)
app.include_router(registros_router)
app.include_router(alergenicos_router)
app.include_router(relatorios_router)
app.include_router(alimentos_router)


@app.get("/")
def root():
    """Endpoint raiz da aplicação."""
    return {"app": APP_NAME, "version": APP_VERSION}
