# Organize files into appropriate directories

# Move frontend files
Move-Item -Path "App.tsx", "index.html", "index.tsx", "components", "pages", "services", "constants.ts", "types.ts", ".env.local", "vite.config.ts", "tsconfig.json" -Destination "frontend" -Force

# Move documentation files
Move-Item -Path "AI Practitioner Canvas_ Comprehensive Development.md", "AI Practitioner Canvas_ Comprehensive Development.pdf", "Screens.docx", "screens.pdf" -Destination "docs" -Force

# Move package.json to frontend
Move-Item -Path "package.json" -Destination "frontend" -Force

# Move metadata.json to backend
Move-Item -Path "metadata.json" -Destination "backend" -Force

# Move git configuration files to root
Move-Item -Path ".git", ".gitignore" -Destination ".." -Force

Write-Host "Files have been organized into their respective directories."
