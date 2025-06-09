from typing import Dict, Any
from pydantic import BaseModel

class MockApiResponse(BaseModel):
    status: str
    data: Dict[str, Any]

class MockApiService:
    def __init__(self):
        self.mock_data = {
            "projects": [
                {"id": 1, "name": "Project 1", "description": "First project"},
                {"id": 2, "name": "Project 2", "description": "Second project"}
            ],
            "components": [
                {"id": 1, "name": "Component 1", "type": "processor"},
                {"id": 2, "name": "Component 2", "type": "connector"}
            ]
        }

    def get_projects(self) -> MockApiResponse:
        return MockApiResponse(status="success", data={"projects": self.mock_data["projects"]})

    def get_components(self) -> MockApiResponse:
        return MockApiResponse(status="success", data={"components": self.mock_data["components"]})
