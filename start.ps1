# PowerShell script to start Contoso Coffee Application
Write-Host "Starting Contoso Coffee Application..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend will run on: http://localhost:3001" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Red
Write-Host ""

Set-Location $PSScriptRoot
npm run dev
