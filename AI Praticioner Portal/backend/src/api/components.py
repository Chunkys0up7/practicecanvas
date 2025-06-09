from fastapi import APIRouter, HTTPException
from src.services.mock_api_service import MockApiService

router = APIRouter(prefix="/components", tags=["components"])
mock_service = MockApiService()

@router.get("/")
async def get_components():
    response = mock_service.get_components()
    if response.status != "success":
        raise HTTPException(status_code=500, detail="Failed to fetch components")
    return response.data["components"]

@router.get("/{component_id}")
async def get_component(component_id: int):
    components = mock_service.get_components().data["components"]
    component = next((c for c in components if c["id"] == component_id), None)
    if not component:
        raise HTTPException(status_code=404, detail="Component not found")
    return component
