"""Service do modulo de registros."""

from datetime import date

from app.domain.registros.registro_factory import RegistroAlimentarFactory


class RegistroAlimentarService:
    """Orquestra operacoes de registros alimentares."""

    def __init__(self, repo, bebe_repo) -> None:
        self.repo = repo
        self.bebe_repo = bebe_repo

    def create(self, bebe_id: str, dto):
        bebe = self.bebe_repo.get_by_id(bebe_id)
        if not bebe or not bebe.ativo:
            raise ValueError("Bebê não encontrado.")
        registro = RegistroAlimentarFactory.make_registro(dto, bebe_id=bebe_id)
        return self.repo.save(registro)

    def list(self, bebe_id: str):
        return self.repo.list_by_bebe(bebe_id)

    def list_filtered(
        self,
        bebe_id: str,
        target_date: date | None = None,
        categoria: str | None = None,
        semana_atual: bool = False,
    ):
        if semana_atual:
            return self.alimentos_semana_atual(bebe_id)
        if target_date:
            return self.repo.list_by_date(bebe_id, target_date)
        if categoria:
            return self.repo.list_by_category(bebe_id, categoria)
        return self.list(bebe_id)

    def get(self, bebe_id: str, registro_id: str):
        registro = self.repo.get_by_id(registro_id)
        if not registro or registro.bebe_id != bebe_id:
            return None
        return registro

    def update(self, bebe_id: str, registro_id: str, dto):
        registro = self.get(bebe_id, registro_id)
        if not registro:
            raise ValueError("Registro não encontrado.")
        registro.aplicar_atualizacao_from_any(dto.model_dump(exclude_unset=True))
        return self.repo.update(registro)

    def delete(self, bebe_id: str, registro_id: str) -> None:
        registro = self.get(bebe_id, registro_id)
        if not registro:
            raise ValueError("Registro não encontrado.")
        self.repo.delete(registro_id)

    def alimentos_semana_atual(self, bebe_id: str):
        hoje = date.today()
        return self.repo.list_by_week(bebe_id, hoje.isocalendar().year, hoje.isocalendar().week)
