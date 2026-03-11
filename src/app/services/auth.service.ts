import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './http.service';
import { AppConfigService } from './app-config.service';
import { LoginRequest, LoginResponse, UserData, AuthState, TokenData, ForgotPasswordResponse, ResetPasswordResponse } from '../models/auth.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY_TOKEN = 'auth_token';
  private readonly STORAGE_KEY_USER = 'auth_user';
  private readonly STORAGE_KEY_EXPIRY = 'auth_expiry';
  private readonly STORAGE_KEY_REMEMBER = 'auth_remember';

  // Auth state signals
  private authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    tokenExpiry: null,
  });

  // Public computed signals
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly currentUser = computed(() => this.authState().user);
  readonly token = computed(() => this.authState().token);

  private tokenCheckInterval: any;

  constructor(
    private httpService: HttpService,
    private configService: AppConfigService,
    private router: Router
  ) {
    this.initializeAuthState();
    this.startTokenExpiryCheck();
  }

  /**
   * Initialize auth state from localStorage
   */
  private initializeAuthState(): void {
    const token = localStorage.getItem(this.STORAGE_KEY_TOKEN);
    const userJson = localStorage.getItem(this.STORAGE_KEY_USER);
    const expiryStr = localStorage.getItem(this.STORAGE_KEY_EXPIRY);

    if (token && userJson && expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      const now = Date.now();

      // Check if token is still valid
      if (expiry > now) {
        const user: UserData = JSON.parse(userJson);
        this.authState.set({
          isAuthenticated: true,
          user,
          token,
          tokenExpiry: expiry,
        });
      } else {
        // Token expired, clear storage
        this.clearStorage();
      }
    }
  }

  /**
   * Start periodic token expiry check
   */
  private startTokenExpiryCheck(): void {
    // Check every minute
    this.tokenCheckInterval = setInterval(() => {
      const expiry = this.authState().tokenExpiry;
      if (expiry && Date.now() >= expiry) {
        console.log('Token expired, logging out...');
        this.logout();
      }
    }, 60000); // 60 seconds
  }

  /**
   * Clear localStorage
   */
  private clearStorage(): void {
    localStorage.removeItem(this.STORAGE_KEY_TOKEN);
    localStorage.removeItem(this.STORAGE_KEY_USER);
    localStorage.removeItem(this.STORAGE_KEY_EXPIRY);
    localStorage.removeItem(this.STORAGE_KEY_REMEMBER);
  }

  /**
   * Store auth data in localStorage
   */
  private storeAuthData(token: string, user: UserData, rememberMe: boolean): void {
    const tokenExpiryHours = this.configService.getAuthConfig()?.tokenExpiryHours || 24;
    const expiryHours = rememberMe ? tokenExpiryHours * 7 : tokenExpiryHours; // 7x longer if remember me
    const expiry = Date.now() + expiryHours * 60 * 60 * 1000;

    localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
    localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
    localStorage.setItem(this.STORAGE_KEY_EXPIRY, expiry.toString());
    localStorage.setItem(this.STORAGE_KEY_REMEMBER, rememberMe.toString());

    this.authState.set({
      isAuthenticated: true,
      user,
      token,
      tokenExpiry: expiry,
    });
    console.log('Auth state updated:', this.authState());
  }

  /**
   * Login with credentials
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const endpoint = this.configService.getLoginEndpoint();
    return this.httpService.post<LoginResponse>(endpoint, credentials).pipe(
      tap((response: LoginResponse) => {
        if (response.success) {
          const userdata: UserData = {
            id: response.data?.userId,
            name: response.data?.name,
            email: response.data?.username,
            phone: response.data?.phone,
            role: response.data?.role,
            userType: response.data?.userType,
            tenantId: response.data?.tenantId,
            refreshToken: response.data?.refreshToken,
          };
          this.storeAuthData(response.data.token, userdata, credentials.rememberMe || false);
        }
      })
    );
  }

  /**
   * Forgot password — sends reset instructions to the user's email
   */
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    const endpoint = 'Security/ForgotPassword';
    return this.httpService.post<ForgotPasswordResponse>(endpoint, { email });
  }

  /**
   * Reset password — sets a new password using the reset token
   */
  resetPassword(token: string, newPassword: string): Observable<ResetPasswordResponse> {
    const endpoint = 'Security/ResetPassword';
    return this.httpService.post<ResetPasswordResponse>(endpoint, { token, newPassword });
  }


  /**
   * Logout user
   */
  logout(): void {
    // Clear state
    this.authState.set({
      isAuthenticated: false,
      user: null,
      token: null,
      tokenExpiry: null,
    });

    // Clear storage
    this.clearStorage();

    // Navigate to login if login is required
    if (this.configService.isLoginRequired()) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.authState().token;
  }

  /**
   * Get current user
   */
  getUser(): UserData | null {
    return this.authState().user;
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry(): number | null {
    return this.authState().tokenExpiry;
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  isTokenExpiringSoon(): boolean {
    const expiry = this.authState().tokenExpiry;
    if (!expiry) return false;

    const fiveMinutes = 5 * 60 * 1000;
    return expiry - Date.now() < fiveMinutes;
  }

  /**
   * Refresh token (if backend supports it)
   */
  refreshToken(): Observable<LoginResponse> {
    const endpoint = 'Security/RefreshToken';
    return this.httpService.post<LoginResponse>(endpoint, {}).pipe(
      tap((response) => {
        if (response.success && response.token) {
          const rememberMe = localStorage.getItem(this.STORAGE_KEY_REMEMBER) === 'true';
          this.storeAuthData(response.token, response.user, rememberMe);
        }
      })
    );
  }

  /**
   * Update user data
   */
  updateUser(user: UserData): void {
    const currentState = this.authState();
    this.authState.set({
      ...currentState,
      user,
    });
    localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
  }

  /**
   * Cleanup on service destroy
   */
  ngOnDestroy(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }
}
