"""Integration tests for healthcheck routes."""

import pytest
from flask.testing import FlaskClient


@pytest.mark.integration
def test_healthcheck_get_ok(client: FlaskClient):
    """Test GET /healthcheck returns 200 with status ok."""
    response = client.get("/healthcheck")

    assert response.status_code == 200

    json_data = response.get_json()
    assert json_data is not None
    assert json_data["status"] == "ok"


@pytest.mark.integration
def test_healthcheck_post_ok(client: FlaskClient):
    """Test POST /healthcheck returns 200 with status ok."""
    response = client.post("/healthcheck")

    assert response.status_code == 200

    json_data = response.get_json()
    assert json_data is not None
    assert json_data["status"] == "ok"
