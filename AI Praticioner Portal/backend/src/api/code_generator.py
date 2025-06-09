from fastapi import APIRouter, HTTPException
from src.services.gemini_service import GeminiService

router = APIRouter(prefix="/code", tags=["code-generator"])
gemini_service = GeminiService()

@router.post("/generate")
async def generate_code(prompt: str):
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    response = gemini_service.generate_code(prompt)
    if response.status != "success":
        raise HTTPException(status_code=500, detail=response.error)
    
    return {"code": response.content}
