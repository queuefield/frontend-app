# Application Configuration Guide

## Overview
This application uses a configuration file (`config.json`) to manage environment-specific settings. This allows you to deploy the same codebase to multiple locations with different configurations.

## Configuration File Location
The configuration file is located at: `public/config.json`

This file is loaded at application startup before any components are initialized.

## Configuration Structure

```json
{
  "environment": "development",
  "country": "US",
  "locale": "en-US",
  "timezone": "America/New_York",
  "apiUrls": {
    "baseUrl": "https://api.example.com",
    "authUrl": "https://api.dev.ic.afaqydev.me/auth",
    "userUrl": "https://api.dev.ic.afaqydev.me/users",
    "dataUrl": "https://api.dev.ic.afaqydev.me/data"
  },
  "features": {
    "enableAnalytics": true,
    "enableLogging": true,
    "enableDebugMode": true
  },
  "application": {
    "name": "Storru",
    "version": "1.0.0",
    "supportEmail": "support@example.com",
    "maxUploadSize": 10485760,
    "sessionTimeout": 3600
  },
  "thirdParty": {
    "googleMapsApiKey": "",
    "stripePublicKey": "",
    "firebaseConfig": {}
  }
}
```

## Using the Configuration Service

### Inject the Service

```typescript
import { AppConfigService } from './services/app-config.service';

export class MyComponent {
  constructor(private configService: AppConfigService) {}
}
```

### Access Configuration Values

```typescript
// Get environment
const env = this.configService.getEnvironment();

// Get country and locale
const country = this.configService.getCountry();
const locale = this.configService.getLocale();
const timezone = this.configService.getTimezone();

// Get API URLs
const baseUrl = this.configService.getApiBaseUrl();
const authUrl = this.configService.getApiUrl('authUrl');
const allUrls = this.configService.getApiUrls();

// Check feature flags
if (this.configService.isFeatureEnabled('enableAnalytics')) {
  // Initialize analytics
}

// Get application info
const appName = this.configService.getApplicationName();
const version = this.configService.getApplicationVersion();
const timeout = this.configService.getSessionTimeout();
const maxSize = this.configService.getMaxUploadSize();

// Get third-party config
const googleKey = this.configService.getThirdPartyValue('googleMapsApiKey');
```

## Deployment for Different Locations

### Method 1: Replace config.json Before Build
1. Keep different config files: `config.production.json`, `config.uae.json`, etc.
2. Before building, copy the appropriate config:
   ```bash
   # For production US
   cp public/config.production.json public/config.json
   npm run build
   
   # For UAE deployment
   cp public/config.uae.json public/config.json
   npm run build
   ```

### Method 2: Replace After Build
1. Build the application once
2. Replace `dist/browser/config.json` with the appropriate config for each deployment
3. Deploy to different servers

### Method 3: Environment-Based Build Scripts
Add scripts to `package.json`:
```json
{
  "scripts": {
    "build:prod": "cp public/config.production.json public/config.json && ng build",
    "build:uae": "cp public/config.uae.json public/config.json && ng build",
    "build:staging": "cp public/config.staging.json public/config.json && ng build"
  }
}
```

## Example Configurations Provided

1. **config.json** - Development configuration (default)
2. **config.production.json** - US Production configuration
3. **config.uae.json** - UAE/Dubai configuration example

## Best Practices

1. **Never commit sensitive data** - Keep API keys and secrets out of the config files in the repository
2. **Use environment variables** - For CI/CD pipelines, inject sensitive values during deployment
3. **Validate configuration** - The service will log errors if config fails to load
4. **Type safety** - Use the `AppConfig` interface for type-safe access
5. **Feature flags** - Use the `features` section to enable/disable functionality per environment

## Security Notes

- The config file is publicly accessible (in the `public` folder)
- **DO NOT** store sensitive secrets or private API keys in this file
- For sensitive configuration, use server-side environment variables or secure vaults
- The config file is meant for non-sensitive, environment-specific settings
