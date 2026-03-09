import { Injectable, signal } from '@angular/core';
import { AppConfig } from '../models/app-config.model';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  private config = signal<AppConfig | null>(null);
  private configLoaded = signal<boolean>(false);

  /**
   * Load configuration from config.json file
   * This should be called during app initialization
   */
  async loadConfig(): Promise<void> {
    try {
      const response = await fetch('/config.json');
      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.statusText}`);
      }
      const configData = await response.json();
      this.config.set(configData);
      this.configLoaded.set(true);
      console.log('Application configuration loaded successfully', configData);
    } catch (error) {
      console.error('Error loading application configuration:', error);
      throw error;
    }
  }

  /**
   * Get the entire configuration object
   */
  getConfig(): AppConfig | null {
    return this.config();
  }

  /**
   * Check if configuration has been loaded
   */
  isConfigLoaded(): boolean {
    return this.configLoaded();
  }

  /**
   * Get environment name
   */
  getEnvironment(): string {
    return this.config()?.environment || 'unknown';
  }

  /**
   * Get country code
   */
  getCountry(): string {
    return this.config()?.country || '';
  }

  /**
   * Get locale
   */
  getLocale(): string {
    return this.config()?.locale || 'en-US';
  }

  /**
   * Get timezone
   */
  getTimezone(): string {
    return this.config()?.timezone || 'UTC';
  }

  /**
   * Get API base URL
   */
  getApiBaseUrl(): string {
    return this.config()?.apiUrls.baseUrl || '';
  }

  /**
   * Get specific API URL
   */
  getApiUrl(key: keyof AppConfig['apiUrls']): string {
    return this.config()?.apiUrls[key] || '';
  }

  /**
   * Get all API URLs
   */
  getApiUrls(): AppConfig['apiUrls'] | undefined {
    return this.config()?.apiUrls;
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config()?.features[feature] || false;
  }

  /**
   * Get application info
   */
  getApplicationInfo(): AppConfig['application'] | undefined {
    return this.config()?.application;
  }

  /**
   * Get application name
   */
  getApplicationName(): string {
    return this.config()?.application.name || '';
  }

  /**
   * Get application version
   */
  getApplicationVersion(): string {
    return this.config()?.application.version || '';
  }

  /**
   * Get third-party configuration
   */
  getThirdPartyConfig(): AppConfig['thirdParty'] | undefined {
    return this.config()?.thirdParty;
  }

  /**
   * Get specific third-party config value
   */
  getThirdPartyValue<K extends keyof AppConfig['thirdParty']>(
    key: K
  ): AppConfig['thirdParty'][K] | undefined {
    return this.config()?.thirdParty[key];
  }

  /**
   * Get session timeout in seconds
   */
  getSessionTimeout(): number {
    return this.config()?.application.sessionTimeout || 3600;
  }

  /**
   * Get max upload size in bytes
   */
  getMaxUploadSize(): number {
    return this.config()?.application.maxUploadSize || 10485760; // 10MB default
  }

  /**
   * Get theme configuration
   */
  getTheme(): AppConfig['theme'] | undefined {
    return this.config()?.theme;
  }

  /**
   * Get theme name
   */
  getThemeName(): string {
    return this.config()?.theme.name || 'default';
  }

  /**
   * Get authentication configuration
   */
  getAuthConfig(): AppConfig['authentication'] | undefined {
    return this.config()?.authentication;
  }

  /**
   * Check if login is required
   */
  isLoginRequired(): boolean {
    return this.config()?.authentication?.requireLogin || false;
  }

  /**
   * Get login method
   */
  getLoginMethod(): 'username' | 'phone' | 'otp' {
    return this.config()?.authentication.loginMethod || 'username';
  }

  /**
   * Check if remember me should be shown
   */
  showRememberMe(): boolean {
    return this.config()?.authentication.showRememberMe || false;
  }

  /**
   * Get login endpoint
   */
  getLoginEndpoint(): string {
    return this.config()?.authentication.loginEndpoint || 'Security/LoginIC';
  }
}
