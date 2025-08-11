# Deployment Validation Script for Contoso Coffee

param(
    [Parameter(Mandatory=$true)]
    [string]$AppServiceUrl
)

Write-Host "Validating Contoso Coffee deployment..." -ForegroundColor Green
Write-Host "App URL: $AppServiceUrl" -ForegroundColor Yellow

# Test API health endpoint
Write-Host "Testing API health endpoint..." -ForegroundColor Blue
try {
    $healthResponse = Invoke-RestMethod -Uri "$AppServiceUrl/api/health" -Method GET
    if ($healthResponse.status -eq "OK") {
        Write-Host "✅ API health check passed" -ForegroundColor Green
        Write-Host "   Message: $($healthResponse.message)" -ForegroundColor Gray
    } else {
        Write-Host "❌ API health check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ API health check failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test products API
Write-Host "Testing products API..." -ForegroundColor Blue
try {
    $productsResponse = Invoke-RestMethod -Uri "$AppServiceUrl/api/products" -Method GET
    if ($productsResponse -and $productsResponse.Count -gt 0) {
        Write-Host "✅ Products API working" -ForegroundColor Green
        Write-Host "   Found $($productsResponse.Count) products" -ForegroundColor Gray
    } else {
        Write-Host "❌ Products API returned no data" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Products API failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test frontend (HTML response)
Write-Host "Testing frontend..." -ForegroundColor Blue
try {
    $frontendResponse = Invoke-WebRequest -Uri $AppServiceUrl -Method GET
    if ($frontendResponse.StatusCode -eq 200 -and $frontendResponse.Content -like "*Contoso Coffee*") {
        Write-Host "✅ Frontend is accessible" -ForegroundColor Green
        Write-Host "   Status Code: $($frontendResponse.StatusCode)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Frontend check failed" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Frontend failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Validation completed!" -ForegroundColor Green
Write-Host "If all tests passed, your Contoso Coffee app is successfully deployed!" -ForegroundColor Cyan
