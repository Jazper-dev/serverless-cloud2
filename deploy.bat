@echo off
echo ============================================
echo    Docker Compose Deployment Script
echo ============================================

:: Set variables
set COMPOSE_FILE=compose.yml
set TARGET_SERVICES=frontend note-service social-service auth-service notification-service api-gateway reverse-proxy

echo.
echo [INFO] Starting deployment process...
echo [INFO] Compose file: %COMPOSE_FILE%
echo [INFO] Target services: %TARGET_SERVICES%
echo.

:: Check if docker-compose file exists
if not exist %COMPOSE_FILE% (
    echo [ERROR] Compose file %COMPOSE_FILE% not found!
    exit /b 1
)

:: Check Docker is running
echo [INFO] Checking Docker status...
docker version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running or not installed!
    exit /b 1
)
echo [SUCCESS] Docker is running

:: Stop and remove old containers
echo.
echo [INFO] Stopping old containers...
docker-compose -f %COMPOSE_FILE% down -v
if errorlevel 1 (
    echo [WARNING] Failed to stop some containers, continuing...
)

:: Clean up Docker system
echo.
echo [INFO] Cleaning up Docker system...
docker system prune -f
if errorlevel 1 (
    echo [WARNING] Docker cleanup had issues, continuing...
)

:: Build containers
echo.
echo [INFO] Building containers...
docker-compose -f %COMPOSE_FILE% build --no-cache %TARGET_SERVICES%
if errorlevel 1 (
    echo [ERROR] Failed to build containers!
    goto :error_handler
)
echo [SUCCESS] Containers built successfully

:: Start containers
echo.
echo [INFO] Starting containers...
docker-compose -f %COMPOSE_FILE% up -d %TARGET_SERVICES%
if errorlevel 1 (
    echo [ERROR] Failed to start containers!
    goto :error_handler
)
echo [SUCCESS] Containers started successfully

:: Wait a moment for containers to initialize
echo.
echo [INFO] Waiting for containers to initialize...
timeout /t 10 /nobreak >nul

:: Check container status
echo.
echo [INFO] Checking container status...
docker ps -a

:: Show logs
echo.
echo [INFO] Showing recent logs...
docker logs frontend --tail 20
docker logs note-service --tail 10
docker logs api-gateway --tail 10

echo.
echo ============================================
echo [SUCCESS] Deployment completed successfully!
echo ============================================
exit /b 0

:error_handler
echo.
echo ============================================
echo [ERROR] Deployment failed!
echo ============================================
echo [INFO] Showing error logs...
docker logs frontend --tail 50
docker ps -a
exit /b 1