import { Injectable, signal, effect } from '@angular/core';

export type Language = 'en' | 'ar' | 'fr';

export interface TranslationData {
  [key: string]: string | TranslationData;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly STORAGE_KEY = 'preferred-language';
  
  // Current language signal
  readonly currentLanguage = signal<Language>(this.getStoredLanguage());
  
  // Translation data for each language
  private translations = signal<Record<Language, TranslationData>>({
    en: {},
    ar: {},
    fr: {}
  });

  constructor() {
    // Load translations for all languages
    this.loadTranslations();
    
    // Effect to handle language changes
    effect(() => {
      const lang = this.currentLanguage();
      this.applyLanguageSettings(lang);
      localStorage.setItem(this.STORAGE_KEY, lang);
    });
  }

  /**
   * Get stored language from localStorage or default to 'en'
   */
  private getStoredLanguage(): Language {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'en' || stored === 'ar' || stored === 'fr') {
      return stored;
    }
    return 'en';
  }

  /**
   * Load translation files
   */
  private async loadTranslations(): Promise<void> {
    try {
      const [en, ar, fr] = await Promise.all([
        import('../../assets/i18n/en.json'),
        import('../../assets/i18n/ar.json'),
        import('../../assets/i18n/fr.json')
      ]);

      this.translations.set({
        en: en.default,
        ar: ar.default,
        fr: fr.default
      });
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  /**
   * Apply language-specific settings (RTL for Arabic)
   */
  private applyLanguageSettings(lang: Language): void {
    const htmlElement = document.documentElement;
    
    // Set language attribute
    htmlElement.setAttribute('lang', lang);
    
    // Set direction (RTL for Arabic, LTR for others)
    if (lang === 'ar') {
      htmlElement.setAttribute('dir', 'rtl');
    } else {
      htmlElement.setAttribute('dir', 'ltr');
    }
  }

  /**
   * Change the current language
   */
  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
  }

  /**
   * Get translation for a key
   * Supports nested keys using dot notation (e.g., 'home.title')
   */
  translate(key: string): string {
    const lang = this.currentLanguage();
    const translations = this.translations()[lang];
    
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
      { code: 'fr', name: 'French', nativeName: 'Français' }
    ];
  }
}
