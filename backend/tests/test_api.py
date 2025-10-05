import json
import pytest
from app import app


@pytest.fixture()
def client():
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


def test_impact_endpoint_basic(client):
    payload = {"velocity_kms": 20.0, "mass_kg": 1e9, "diameter_m": 100}
    r = client.post("/api/impact", data=json.dumps(payload), content_type="application/json")
    assert r.status_code == 200
    j = r.get_json()
    assert j["status"] == "ok"
    assert "impact_energy_j" in j
    assert j["impact_energy_j"] > 0


def test_impact_invalid_input(client):
    payload = {"velocity_kms": "fast", "mass_kg": "big"}
    r = client.post("/api/impact", data=json.dumps(payload), content_type="application/json")
    assert r.status_code == 400
