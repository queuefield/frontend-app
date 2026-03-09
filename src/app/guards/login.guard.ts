import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AppConfigService } from '../services/app-config.service';

/**
 * Login Guard - Prevents authenticated users from accessing login page
 * Redirects to home page if user is already authenticated
 */
export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const configService = inject(AppConfigService);
  const router = inject(Router);

  // Check if login is required in config
  const loginRequired = configService.isLoginRequired();
  
  if (!loginRequired) {
    // Login not required, redirect to home
    return router.createUrlTree(['/']);
  }

  // Check if user is already authenticated
  if (authService.isUserAuthenticated()) {
    // Already logged in, redirect to home or return URL
    const returnUrl = route.queryParams['returnUrl'] || '/';
    return router.createUrlTree([returnUrl]);
  }

  // Not authenticated, allow access to login page
  return true;
};
