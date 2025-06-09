import pytest
from src.services.mock_api_service import MockApiService, MockApiResponse
from src.services.gemini_service import GeminiService, GeminiResponse

def test_mock_api_service_get_projects():
    service = MockApiService()
    response = service.get_projects()
    assert isinstance(response, MockApiResponse)
    assert response.status == "success"
    assert len(response.data["projects"]) == 2

def test_mock_api_service_get_components():
    service = MockApiService()
    response = service.get_components()
    assert isinstance(response, MockApiResponse)
    assert response.status == "success"
    assert len(response.data["components"]) == 2

def test_gemini_service_without_api_key():
    service = GeminiService()
    response = service.generate_code("test prompt")
    assert isinstance(response, GeminiResponse)
    assert response.status == "error"
    assert "GEMINI_API_KEY" in response.error
