# Azure Deployment Script for Contoso Coffee

param(
    [Parameter(Mandatory=$true)]
    [string]$ResourceGroupName,
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "East US",
    
    [Parameter(Mandatory=$false)]
    [string]$AppName = "contoso-coffee-$(Get-Random -Minimum 1000 -Maximum 9999)"
)

Write-Host "Deploying Contoso Coffee to Azure..." -ForegroundColor Green
Write-Host "Resource Group: $ResourceGroupName" -ForegroundColor Yellow
Write-Host "Location: $Location" -ForegroundColor Yellow
Write-Host "App Name: $AppName" -ForegroundColor Yellow

# Check if Azure CLI is installed
if (!(Get-Command az -ErrorAction SilentlyContinue)) {
    Write-Error "Azure CLI is not installed. Please install it first."
    exit 1
}

# Login to Azure (if not already logged in)
Write-Host "Checking Azure login status..." -ForegroundColor Blue
$loginStatus = az account show 2>$null
if (!$loginStatus) {
    Write-Host "Please log in to Azure..." -ForegroundColor Yellow
    az login
}

# Create resource group if it doesn't exist
Write-Host "Creating resource group..." -ForegroundColor Blue
az group create --name $ResourceGroupName --location $Location

# Deploy infrastructure using Bicep
Write-Host "Deploying infrastructure..." -ForegroundColor Blue
$deployment = az deployment group create `
    --resource-group $ResourceGroupName `
    --template-file "../azure/main.bicep" `
    --parameters appName=$AppName `
    --output json | ConvertFrom-Json

if ($deployment.properties.provisioningState -ne "Succeeded") {
    Write-Error "Infrastructure deployment failed"
    exit 1
}

$appServiceName = $deployment.properties.outputs.appServiceName.value
$appServiceUrl = $deployment.properties.outputs.appServiceUrl.value

Write-Host "Infrastructure deployed successfully!" -ForegroundColor Green
Write-Host "App Service Name: $appServiceName" -ForegroundColor Yellow
Write-Host "App Service URL: $appServiceUrl" -ForegroundColor Yellow

# Get publish profile for GitHub Actions
Write-Host "Getting publish profile for GitHub Actions..." -ForegroundColor Blue
$publishProfile = az webapp deployment list-publishing-profiles `
    --resource-group $ResourceGroupName `
    --name $appServiceName `
    --xml

Write-Host "Deployment completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Add the following secret to your GitHub repository:" -ForegroundColor White
Write-Host "   Secret Name: AZURE_WEBAPP_PUBLISH_PROFILE" -ForegroundColor Yellow
Write-Host "   Secret Value: (copy the XML content below)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Publish Profile XML:" -ForegroundColor White
Write-Host $publishProfile -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update the AZURE_WEBAPP_NAME in .github/workflows/azure-deploy.yml to: $appServiceName" -ForegroundColor White
Write-Host "3. Push your code to the main branch to trigger deployment" -ForegroundColor White
Write-Host ""
Write-Host "Your app will be available at: $appServiceUrl" -ForegroundColor Green
