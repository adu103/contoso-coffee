# Azure Deployment Guide for Contoso Coffee

This guide will help you deploy the Contoso Coffee application to Azure using Azure App Service with GitHub Actions for continuous deployment.

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- [Azure subscription](https://azure.microsoft.com/en-us/free/)
- [PowerShell](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell) (Windows) or [PowerShell Core](https://docs.microsoft.com/en-us/powershell/scripting/install/installing-powershell-core-on-linux) (Linux/macOS)
- GitHub repository with admin access

## Architecture

The deployment creates:
- **Azure App Service Plan**: Linux-based hosting plan
- **Azure App Service**: Web application hosting the full-stack app
- **GitHub Actions**: CI/CD pipeline for automatic deployments

## Quick Start

### Option 1: Automated Deployment (Recommended)

1. **Run the deployment script**:
   ```powershell
   cd scripts
   .\deploy-azure.ps1 -ResourceGroupName "contoso-coffee-rg" -Location "East US"
   ```

2. **Configure GitHub Secrets**:
   - Copy the publish profile XML from the script output
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add new secret: `AZURE_WEBAPP_PUBLISH_PROFILE` with the XML content

3. **Update workflow configuration**:
   - Edit `.github/workflows/azure-deploy.yml`
   - Update `AZURE_WEBAPP_NAME` with the app service name from script output

4. **Deploy**:
   ```bash
   git add .
   git commit -m "Add Azure deployment configuration"
   git push origin main
   ```

### Option 2: Manual Azure CLI Deployment

1. **Login to Azure**:
   ```bash
   az login
   ```

2. **Create resource group**:
   ```bash
   az group create --name contoso-coffee-rg --location "East US"
   ```

3. **Deploy infrastructure**:
   ```bash
   az deployment group create \
     --resource-group contoso-coffee-rg \
     --template-file azure/main.bicep \
     --parameters appName=contoso-coffee-app
   ```

4. **Get publish profile**:
   ```bash
   az webapp deployment list-publishing-profiles \
     --resource-group contoso-coffee-rg \
     --name contoso-coffee-app \
     --xml
   ```

5. **Follow steps 2-4 from Option 1**

## File Structure

```
contoso-coffee/
├── .github/
│   └── workflows/
│       └── azure-deploy.yml       # GitHub Actions workflow
├── azure/
│   └── main.bicep                 # Azure infrastructure template
├── scripts/
│   └── deploy-azure.ps1           # PowerShell deployment script
├── backend/
│   ├── server.js                  # Updated for production deployment
│   ├── package.json
│   └── .env.production            # Production environment variables
├── frontend/
│   └── ...                        # React application
└── package.json                   # Root package.json with start script
```

## Configuration Details

### GitHub Actions Workflow

The workflow (`.github/workflows/azure-deploy.yml`) triggers on:
- Push to `main` branch
- Manual trigger via GitHub UI

Build steps:
1. Install Node.js dependencies
2. Build React frontend
3. Create deployment package
4. Deploy to Azure App Service

### Azure Infrastructure

**App Service Plan**:
- SKU: B1 (Basic tier)
- OS: Linux
- Runtime: Node.js 18 LTS

**App Service**:
- HTTPS enforced
- Production environment variables
- Automatic deployment from GitHub

### Production Configuration

**Backend Server**:
- Serves React build files from `/static` directory
- Handles API routes under `/api`
- Fallback to `index.html` for client-side routing

**Environment Variables**:
- `NODE_ENV=production`
- `PORT=8080` (Azure default)

## Monitoring and Management

### Azure Portal
- Navigate to your App Service in the Azure Portal
- Monitor performance, logs, and resource usage
- Configure scaling and custom domains

### Application Logs
```bash
# Stream logs in real-time
az webapp log tail --resource-group contoso-coffee-rg --name your-app-name

# Download log files
az webapp log download --resource-group contoso-coffee-rg --name your-app-name
```

### GitHub Actions
- View deployment history in the Actions tab
- Monitor build and deployment logs
- Trigger manual deployments if needed

## Scaling and Optimization

### Scale Up (Vertical)
```bash
# Upgrade to Standard tier for better performance
az appservice plan update \
  --resource-group contoso-coffee-rg \
  --name your-plan-name \
  --sku S1
```

### Scale Out (Horizontal)
```bash
# Add more instances
az appservice plan update \
  --resource-group contoso-coffee-rg \
  --name your-plan-name \
  --number-of-workers 2
```

### Add Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app contoso-coffee-insights \
  --location "East US" \
  --resource-group contoso-coffee-rg

# Configure in App Service
az webapp config appsettings set \
  --resource-group contoso-coffee-rg \
  --name your-app-name \
  --settings APPINSIGHTS_INSTRUMENTATIONKEY="your-key"
```

## Custom Domain Setup

1. **Purchase domain** (or use existing)
2. **Add custom domain to App Service**:
   ```bash
   az webapp config hostname add \
     --resource-group contoso-coffee-rg \
     --webapp-name your-app-name \
     --hostname yourdomain.com
   ```
3. **Configure SSL certificate**

## Troubleshooting

### Common Issues

**Deployment fails**:
- Check GitHub Actions logs
- Verify Azure credentials in repository secrets
- Ensure App Service name is unique

**App not loading**:
- Check Application Logs in Azure Portal
- Verify environment variables
- Check if build completed successfully

**API not accessible**:
- Verify backend routes are working
- Check CORS configuration
- Review server logs

### Debug Commands

```bash
# Check app status
az webapp show --resource-group contoso-coffee-rg --name your-app-name

# View deployment logs
az webapp log deployment list --resource-group contoso-coffee-rg --name your-app-name

# Test API endpoints
curl https://your-app-name.azurewebsites.net/api/health
```

## Cost Optimization

- **Development**: Use Free tier (F1) for testing
- **Production**: Start with Basic (B1), scale as needed
- **Monitoring**: Set up budget alerts in Azure
- **Auto-scaling**: Configure based on CPU/memory usage

## Security Best Practices

- Enable HTTPS only (already configured)
- Use managed identities for Azure services
- Implement proper authentication for admin features
- Regular security updates for dependencies

## Next Steps

1. **Custom Domain**: Configure your own domain name
2. **SSL Certificate**: Set up custom SSL certificates
3. **Application Insights**: Add detailed monitoring and analytics
4. **Database**: Integrate with Azure SQL or Cosmos DB
5. **CDN**: Add Azure CDN for better performance
6. **Authentication**: Implement user authentication with Azure AD

## Support

For issues related to:
- **Azure**: Check [Azure documentation](https://docs.microsoft.com/en-us/azure/)
- **GitHub Actions**: Review [GitHub Actions documentation](https://docs.github.com/en/actions)
- **Application bugs**: Create an issue in this repository
