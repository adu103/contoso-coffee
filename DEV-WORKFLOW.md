# Development & Production Deployment Guide

## 🏗️ **Deployment Architecture**

This project now supports **two-environment deployment**:

### **🧪 Development Environment**
- **Branch**: `development`
- **URL**: https://contoso-coffee-dev.azurewebsites.net
- **Purpose**: Testing changes before production
- **Trigger**: Any commit to `development` branch

### **🌐 Production Environment**
- **Branch**: `main`
- **URL**: https://contoso-coffee-linux.azurewebsites.net
- **Purpose**: Live production site
- **Trigger**: Any commit to `main` branch

## 🔄 **Development Workflow**

### **Making Changes:**
1. **Create feature branch** from `development`:
   ```bash
   git checkout development
   git pull origin development
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** and commit:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin feature/my-new-feature
   ```

3. **Create Pull Request** to merge into `development`

4. **Test on development site** after merge:
   - Visit: https://contoso-coffee-dev.azurewebsites.net
   - Verify all functionality works

5. **Promote to production** when ready:
   ```bash
   git checkout main
   git merge development
   git push origin main
   ```

### **Emergency Hotfixes:**
For urgent production fixes:
1. Create hotfix branch from `main`
2. Make minimal changes
3. Test on development first (if possible)
4. Merge directly to `main`
5. Merge back to `development` to keep in sync

## 🚀 **GitHub Actions Workflow**

The deployment workflow automatically detects the branch and deploys to the appropriate environment:

```yaml
# Triggers on both branches
branches: [ main, development ]

# Environment selection logic
- main branch → contoso-coffee-linux (production)
- development branch → contoso-coffee-dev (development)
```

## 🔧 **Azure Resources**

### **Production Environment**
- **Resource Group**: `contoso-coffee-linux-rg`
- **App Service**: `contoso-coffee-linux`
- **Region**: Central US
- **SKU**: B1 (Basic)

### **Development Environment**
- **Resource Group**: `contoso-coffee-dev-rg`
- **App Service**: `contoso-coffee-dev`
- **Region**: Central US
- **SKU**: B1 (Basic)

## 🔐 **Authentication**

Both environments use the same Azure Service Principal with access to:
- `contoso-coffee-linux-rg` (production)
- `contoso-coffee-dev-rg` (development)

**GitHub Secret**: `AZURE_CREDENTIALS` (shared for both environments)

## 📊 **Monitoring**

### **Development**
- Monitor at: https://portal.azure.com
- Navigate to: `contoso-coffee-dev-rg` → `contoso-coffee-dev`
- Check logs, metrics, and performance

### **Production**
- Monitor at: https://portal.azure.com
- Navigate to: `contoso-coffee-linux-rg` → `contoso-coffee-linux`
- Set up alerts for critical issues

## 🎯 **Best Practices**

1. **Always test in development first** before merging to main
2. **Keep development and main in sync** regularly
3. **Use descriptive commit messages** for easier tracking
4. **Review changes** in development environment before production
5. **Monitor both environments** for issues
6. **Create feature branches** for new development work

## 🚨 **Troubleshooting**

### **Development Issues**
- Check GitHub Actions for `development` branch builds
- Verify changes at: https://contoso-coffee-dev.azurewebsites.net
- Review Azure logs in development App Service

### **Production Issues**
- Check GitHub Actions for `main` branch builds
- Verify changes at: https://contoso-coffee-linux.azurewebsites.net
- Review Azure logs in production App Service

### **Branch Sync Issues**
```bash
# If development gets behind main
git checkout development
git pull origin main
git push origin development
```

## 📈 **Scaling Considerations**

- **Development**: Can use lower SKU (F1 Free tier) to save costs
- **Production**: Scale up/out based on traffic requirements
- **Database**: Consider separate dev/prod databases when adding persistence
- **Secrets**: Use Azure Key Vault for sensitive configuration

---

**Happy coding! 🚀** Your changes will automatically deploy to development for testing, then to production when ready!
