"""Serviço de orquestração para RegistroAlimentar."""

from datetime import date
from app.domain.registros.registro_factory import RegistroAlimentarFactory


class RegistroService:
    """Orquestra operações de registros alimentares."""

    def __init__(self, repo) -> None:
        self.repo = repo

    def create(self, dto) -> object:
        """Cria um novo registro alimentar."""
        registro = RegistroAlimentarFactory.make_registro(dto)

        if registro.alimento_alergenico:
            pass  # Futuro: integrar com alerta

        return self.repo.save(registro)

    def get(self, registro_id: str) -> object:
        """Busca registro por ID."""
        return self.repo.get_by_id(registro_id)

    def list_by_bebe(self, bebe_id: str) -> list:
        """Lista registros de um bebê."""
        return self.repo.list_by_bebe(bebe_id)

    def list_by_data(self, bebe_id: str, data: date) -> list:
        """Lista registros de uma data."""
        return self.repo.list_by_data(bebe_id, data)

    def list_semana_atual(self, bebe_id: str) -> list:
        """Lista registros da semana atual."""
        return self.repo.list_semana_atual(bebe_id)

    def update(self, registro_id: str, dto) -> object:
        """Atualiza registro existente."""
        registro = self.repo.get_by_id(registro_id)
        if not registro:
            raise ValueError("Registro não encontrado")
        registro.aplicar_atualizacao_from_any(dto.dict(exclude_unset=True))
        return self.repo.update(registro)

    def delete(self, registro_id: str) -> None:
        """Remove registro."""
        self.repo.delete(registro_id)

    def alimentos_semana_por_categoria(self, bebe_id: str) -> dict[str, list[str]]:
        """Retorna alimentos usados na semana atual agrupados por categoria."""
        registros = self.repo.list_semana_atual(bebe_id)
        resultado: dict[str, list[str]] = {}
        for r in registros:
            if r.categoria not in resultado:
                resultado[r.categoria] = []
            if r.nome_alimento not in resultado[r.categoria]:
                resultado[r.categoria].append(r.nome_alimento)
        return resultado
