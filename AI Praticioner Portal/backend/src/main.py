from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api import projects, components, code_generator

app = FastAPI(
    title="AI Practitioner Canvas API",
    description="Backend API for AI Practitioner Canvas",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router)
app.include_router(components.router)
app.include_router(code_generator.router)

@app.get("/")
async def root():
    """API root endpoint"""
    return {"message": "AI Practitioner Canvas Backend API", "version": "1.0.0"}
