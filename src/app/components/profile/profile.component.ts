import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService, Language } from '../../services/translation.service';
import { RegexService } from '../../services/regex.service';
import { AuthService } from '../../services/auth.service';
import { AppConfigService } from '../../services/app-config.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  // Computed signals for translations
  protected readonly title = computed(() => 
    this.translationService.translate('profile.title')
  );
  
  protected readonly subtitle = computed(() => 
    this.translationService.translate('profile.subtitle')
  );
  
  protected readonly languageLabel = computed(() => 
    this.translationService.translate('profile.languageLabel')
  );
  
  protected readonly backToHomeText = computed(() => 
    this.translationService.translate('profile.backToHome')
  );
  
  protected readonly currentLanguageText = computed(() => 
    this.translationService.translate('profile.currentLanguage')
  );

  // Available languages
  protected readonly languages: Array<{ code: Language; name: string; nativeName: string }>;
  
  // Current language
  protected selectedLanguage!: Language;

  // Check if login is required
  protected readonly showLogout: boolean;
  protected currentUser;

  constructor(
    private router: Router,
    protected translationService: TranslationService,
    protected regexService: RegexService,
    protected authService: AuthService,
    private configService: AppConfigService
  ) {
    this.languages = this.translationService.getAvailableLanguages();
    this.selectedLanguage = this.translationService.currentLanguage();
    this.showLogout = this.configService.isLoginRequired();
    this.currentUser = this.authService.currentUser;
  }



  onLanguageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const lang = select.value as Language;
    this.translationService.setLanguage(lang);
    this.selectedLanguage = lang;
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }
}
