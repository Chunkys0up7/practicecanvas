import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.services.mock_api_service import MockApiService
from src.services.gemini_service import GeminiService

client = TestClient(app)

def test_projects_endpoint():
    response = client.get("/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all("id" in project and "name" in project for project in data)

def test_single_project_endpoint():
    response = client.get("/projects/1")
    assert response.status_code == 200
    project = response.json()
    assert project["id"] == 1
    assert "name" in project
    assert "description" in project

def test_nonexistent_project():
    response = client.get("/projects/999")
    assert response.status_code == 404

def test_components_endpoint():
    response = client.get("/components")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert all("id" in component and "name" in component for component in data)

def test_single_component_endpoint():
    response = client.get("/components/1")
    assert response.status_code == 200
    component = response.json()
    assert component["id"] == 1
    assert "name" in component
    assert "type" in component

def test_nonexistent_component():
    response = client.get("/components/999")
    assert response.status_code == 404

def test_code_generation_without_gemini():
    response = client.post("/code/generate", json={"prompt": "test prompt"})
    assert response.status_code == 500
    assert "GEMINI_API_KEY" in response.json()["detail"]

def test_code_generation_with_empty_prompt():
    response = client.post("/code/generate", json={"prompt": ""})
    assert response.status_code == 400
    assert "Prompt is required" in response.json()["detail"]
