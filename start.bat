@echo off
echo Starting Contoso Coffee Application...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3001
echo.
echo Press Ctrl+C to stop both servers
echo.

cd /d "%~dp0"
npm run dev

pause
