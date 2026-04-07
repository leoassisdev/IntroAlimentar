def test_health() -> None:
    import os

    from fastapi.testclient import TestClient

    os.environ["DATABASE_URL"] = "sqlite:////tmp/introalimentar-test.db"

    from main import app

    client = TestClient(app)
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
