import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { AppConfigService } from './services/app-config.service';
import { ThemeService } from './services/theme.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

/**
 * Factory function to initialize app configuration and theme
 */
export function initializeApp(appConfigService: AppConfigService, themeService: ThemeService) {
  return async () => {
    await appConfigService.loadConfig();
    themeService.initializeTheme();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfigService, ThemeService],
      multi: true
    },
     providePrimeNG({
            theme: {
                preset: Aura
            }
        })
  ]
};
