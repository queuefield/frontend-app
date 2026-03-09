import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { AppConfigService } from './app-config.service';
import { AuthService } from './auth.service';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);
  private configService = inject(AppConfigService);
  private authService?: AuthService; // Lazy injection to avoid circular dependency

  private loadingCount = 0;

  /**
   * Get base URL from config
   */
  private getBaseUrl(): string {
    return this.configService.getApiBaseUrl();
  }

  /**
   * Get auth service (lazy injection)
   */
  private getAuthService(): AuthService | null {
    if (!this.authService) {
      try {
        this.authService = inject(AuthService);
      } catch {
        return null;
      }
    }
    return this.authService;
  }

  /**
   * Get default headers with authorization token
   */
  private getHeaders(
    customHeaders?: HttpHeaders | { [header: string]: string | string[] }
  ): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    // Add custom headers
    if (customHeaders) {
      if (customHeaders instanceof HttpHeaders) {
        customHeaders.keys().forEach((key) => {
          const value = customHeaders.get(key);
          if (value) {
            headers = headers.set(key, value);
          }
        });
      } else {
        Object.keys(customHeaders).forEach((key) => {
          const value = customHeaders[key];
          if (value) {
            headers = headers.set(key, value);
          }
        });
      }
    }

    return headers;
  }

  /**
   * Build full URL
   */
  private buildUrl(endpoint: string): string {
    const baseUrl = this.getBaseUrl();
    // Remove trailing slash from baseUrl
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    // Remove leading slash from endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${cleanBaseUrl}/${cleanEndpoint}`;
  }

  /**
   * Handle HTTP errors
   */
  private handleError<T>(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      // Handle specific status codes
      if (error.status === 401) {
        // Unauthorized - clear auth and redirect to login
        const authService = this.getAuthService();
        authService?.logout();
      } else if (error.status === 403) {
        errorMessage = 'Access forbidden';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error';
      }
    }

    console.error('HTTP Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Increment loading counter
   */
  private startLoading(): void {
    this.loadingCount++;
  }

  /**
   * Decrement loading counter
   */
  private stopLoading(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
  }

  /**
   * Check if any requests are loading
   */
  isLoading(): boolean {
    return this.loadingCount > 0;
  }

  /**
   * GET request
   */
  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders(options?.headers);

    return this.http.get<T>(url, { ...options, headers } as any).pipe(
      tap(() => this.stopLoading()),
      catchError((error) => {
        this.stopLoading();
        return this.handleError<T>(error);
      })
    ) as Observable<T>;
  }

  /**
   * POST request
   */
  post<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders(options?.headers);
    return this.http.post<T>(url, body, { ...options, headers } as any).pipe(
      tap(() => this.stopLoading()),
      catchError((error) => {
        this.stopLoading();
        return this.handleError<T>(error);
      })
    ) as Observable<T>;
  }

  /**
   * PUT request
   */
  put<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders(options?.headers);

    return this.http.put<T>(url, body, { ...options, headers } as any).pipe(
      tap(() => this.stopLoading()),
      catchError((error) => {
        this.stopLoading();
        return this.handleError<T>(error);
      })
    ) as Observable<T>;
  }

  /**
   * DELETE request
   */
  delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders(options?.headers);

    return this.http.delete<T>(url, { ...options, headers } as any).pipe(
      tap(() => this.stopLoading()),
      catchError((error) => {
        this.stopLoading();
        return this.handleError<T>(error);
      })
    ) as Observable<T>;
  }

  /**
   * PATCH request
   */
  patch<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    this.startLoading();
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders(options?.headers);

    return this.http.patch<T>(url, body, { ...options, headers } as any).pipe(
      tap(() => this.stopLoading()),
      catchError((error) => {
        this.stopLoading();
        return this.handleError<T>(error);
      })
    ) as Observable<T>;
  }
}
