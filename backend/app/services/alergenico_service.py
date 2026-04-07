"""Serviço de orquestração para RegistroAlergenico."""

from datetime import date
from app.domain.alergenicos.alergenico_factory import RegistroAlergenicoFactory
from app.domain.alergenicos.alergenico_entity import RegistroAlergenico


class AlergenicoService:
    """Orquestra operações de registros de alergênicos."""

    def __init__(self, repo) -> None:
        self.repo = repo

    def create(self, dto) -> RegistroAlergenico:
        """Cria uma nova oferta de alergênico."""
        registros_existentes = self.repo.list_by_alimento(
            RegistroAlergenicoFactory.bebe_id_from(dto),
            RegistroAlergenicoFactory.nome_alimento_from(dto),
        )

        pode = RegistroAlergenico.pode_oferecer(
            registros_existentes,
            RegistroAlergenicoFactory.nome_alimento_from(dto),
            RegistroAlergenicoFactory.data_oferta_from(dto),
        )
        if not pode:
            raise ValueError(
                "Não é possível oferecer este alimento: intervalo mínimo de 3 dias "
                "ou máximo de 5 ofertas atingido."
            )

        registro = RegistroAlergenicoFactory.make_alergenico(dto)
        return self.repo.save(registro)

    def list_by_bebe(self, bebe_id: str) -> list[RegistroAlergenico]:
        """Lista todos os registros de alergênicos de um bebê."""
        return self.repo.list_by_bebe(bebe_id)

    def list_by_alimento(self, bebe_id: str, alimento: str) -> list[RegistroAlergenico]:
        """Lista registros de um alimento específico."""
        return self.repo.list_by_alimento(bebe_id, alimento)

    def verificar_disponibilidade(self, bebe_id: str, alimento: str, data_pretendida: date = None) -> dict:
        """Verifica se um alimento pode ser oferecido."""
        if data_pretendida is None:
            data_pretendida = date.today()

        registros = self.repo.list_by_alimento(bebe_id, alimento)
        total = RegistroAlergenico.total_ofertas(registros, alimento)
        pode = RegistroAlergenico.pode_oferecer(registros, alimento, data_pretendida)

        if not pode and total >= 5:
            msg = f"Máximo de 5 ofertas atingido para {alimento}."
        elif not pode:
            msg = f"Intervalo mínimo de 3 dias não respeitado para {alimento}."
        else:
            msg = f"{alimento} pode ser oferecido. Oferta {total + 1}/5."

        return {
            "alimento": alimento,
            "pode_oferecer": pode,
            "total_ofertas": total,
            "mensagem": msg,
        }
