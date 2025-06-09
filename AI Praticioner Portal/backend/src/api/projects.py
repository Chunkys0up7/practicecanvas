from fastapi import APIRouter, HTTPException
from src.services.mock_api_service import MockApiService

router = APIRouter(prefix="/projects", tags=["projects"])
mock_service = MockApiService()

@router.get("/")
async def get_projects():
    response = mock_service.get_projects()
    if response.status != "success":
        raise HTTPException(status_code=500, detail="Failed to fetch projects")
    return response.data["projects"]

@router.get("/{project_id}")
async def get_project(project_id: int):
    projects = mock_service.get_projects().data["projects"]
    project = next((p for p in projects if p["id"] == project_id), None)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
