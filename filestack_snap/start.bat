@echo off
echo 🚀 Starting Filestack Documentation Indexer...

:: Check if Docker Desktop is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Desktop is not running. Starting Docker Desktop...
    echo Please wait while Docker Desktop starts up...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    
    echo ⏳ Waiting for Docker Desktop to start...
    :wait_docker
    timeout /t 5 /nobreak >nul
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        echo Still waiting for Docker...
        goto wait_docker
    )
    echo ✅ Docker Desktop is now running!
)

:: Check if .env file exists, if not copy from env.example
if not exist ".env" (
    if exist "env.example" (
        echo 📝 Creating .env file from env.example...
        copy env.example .env >nul
    ) else (
        echo ⚠️ No .env file found. Please create one with your OPENAI_API_KEY
    )
)

:: Start Qdrant database
echo 🐳 Starting Qdrant database...
docker-compose up -d

:: Wait for Qdrant to be ready
echo ⏳ Waiting for Qdrant to be ready...
timeout /t 10 /nobreak >nul

:: Check if Qdrant is responding
curl -s http://localhost:6333/collections >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Qdrant is ready!
) else (
    echo ❌ Qdrant may not be fully ready yet. Check with: docker-compose logs qdrant
)

echo.
echo 🎯 Next steps:
echo 1. Index your documents: npm run index
echo 2. Search documents: npm run search
echo.
echo 📚 Your documents will be indexed from: ./complete_filestack_js/structured/
echo 🔍 Qdrant dashboard: http://localhost:6333/dashboard
echo.
echo Happy indexing! 🚀

pause