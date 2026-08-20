@echo off
echo ===================================
echo    Starting Agvis Workspace
echo ===================================
echo.

echo [1/2] Starting Backend (FastAPI on port 8000)...
start "Agvis Backend" cmd /k "cd /d %~dp0backend && python main.py"

timeout /t 2 /nobreak >nul

echo [2/2] Starting Frontend (Vite on port 5173)...
start "Agvis Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ===================================
echo    Agvis is starting...
echo ===================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Two windows will open:
echo - Agvis Backend (Python)
echo - Agvis Frontend (Vite)
echo.
echo Close those windows to stop the servers.
echo.
pause
