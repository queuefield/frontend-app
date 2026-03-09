import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppConfigService } from '../services/app-config.service';

/**
 * Auth Guard - Protects routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const configService = inject(AppConfigService);
  const router = inject(Router);

  // Check if login is required in config
  const loginRequired = configService.isLoginRequired();
  
  if (!loginRequired) {
    // Login not required, allow access
    return true;
  }

  // Check if user is authenticated
  if (authService.isUserAuthenticated()) {
    return true;
  }

  // Not authenticated, redirect to login
  console.log('Access denied. Redirecting to login...');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
