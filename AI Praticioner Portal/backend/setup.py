from setuptools import setup, find_packages

setup(
    name="ai-practitioner-portal-backend",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "fastapi>=0.104.1",
        "uvicorn>=0.24.0",
        "pydantic>=2.4.2",
        "python-jose[cryptography]>=3.3.0",
        "passlib[bcrypt]>=1.7.4",
        "pytest>=7.4.3",
        "pytest-cov>=4.1.0",
    ],
    python_requires=">=3.8",
)
