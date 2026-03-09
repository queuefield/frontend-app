import { Injectable, signal, effect } from '@angular/core';
import { AppConfigService } from './app-config.service';
import { ThemePalette } from '../models/app-config.model';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<ThemePalette | null>(null);

  constructor(private configService: AppConfigService) {
    // Effect to apply theme when it changes
    effect(() => {
      const theme = this.currentTheme();
      if (theme) {
        this.applyTheme(theme);
      }
    });
  }

  /**
   * Initialize theme from config
   */
  initializeTheme(): void {
    const config = this.configService.getConfig();
    if (config?.theme) {
      this.currentTheme.set(config.theme);
    }
  }

  /**
   * Apply theme to the document by setting CSS custom properties
   */
  private applyTheme(theme: ThemePalette): void {
    const root = document.documentElement;

    // Apply color variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${this.camelToKebab(key)}`, value);
    });

    // Apply typography variables
    Object.entries(theme.typography).forEach(([key, value]) => {
      root.style.setProperty(`--${this.camelToKebab(key)}`, String(value));
    });

    // Apply spacing variables
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--${this.camelToKebab(key)}`, value);
    });

    // Apply effects variables
    Object.entries(theme.effects).forEach(([key, value]) => {
      root.style.setProperty(`--${this.camelToKebab(key)}`, String(value));
    });

    console.log(`Theme "${theme.name}" applied successfully`);
  }

  /**
   * Convert camelCase to kebab-case
   */
  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Get current theme
   */
  getTheme(): ThemePalette | null {
    return this.currentTheme();
  }

  /**
   * Get theme name
   */
  getThemeName(): string {
    return this.currentTheme()?.name || 'default';
  }

  /**
   * Get a specific color from the theme
   */
  getColor(colorKey: keyof ThemePalette['colors']): string {
    return this.currentTheme()?.colors[colorKey] || '';
  }

  /**
   * Get CSS variable name for a color
   */
  getColorVar(colorKey: keyof ThemePalette['colors']): string {
    return `var(--color-${this.camelToKebab(colorKey)})`;
  }

  /**
   * Get all theme colors
   */
  getColors(): ThemePalette['colors'] | undefined {
    return this.currentTheme()?.colors;
  }

  /**
   * Get typography settings
   */
  getTypography(): ThemePalette['typography'] | undefined {
    return this.currentTheme()?.typography;
  }

  /**
   * Get spacing settings
   */
  getSpacing(): ThemePalette['spacing'] | undefined {
    return this.currentTheme()?.spacing;
  }

  /**
   * Get effects settings
   */
  getEffects(): ThemePalette['effects'] | undefined {
    return this.currentTheme()?.effects;
  }
}
