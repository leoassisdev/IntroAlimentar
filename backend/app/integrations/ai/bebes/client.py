"""Cliente placeholder para futuras integrações de IA de bebes."""

from app.integrations.ai.bebes.payloads import BebeContextPayload


class BebeAiClient:
    """Cliente futuro para enriquecimento de contexto do bebe."""

    def build_context(self, payload: BebeContextPayload) -> dict[str, str | int]:
        return payload.model_dump()
