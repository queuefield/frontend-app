import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

// Add endpoints here that should NOT trigger automatic error toast messages
const EXCLUDED_URLS: string[] = [
  // '/api/v1/auth/check',
  // '/api/v1/silent-health'
];

export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  // Check if current URL is in the excluded list
  const isExcluded = EXCLUDED_URLS.some(url => req.url.includes(url));

  return next(req).pipe(
    tap({
      next: (event) => {
        // Only look at actual HttpResponse events
        if (event instanceof HttpResponse && !isExcluded) {
          const body = event.body as any;

          // Check if the API returned a structured response with success: false
          if (body && typeof body === 'object' && 'success' in body) {
            if (body.success === false) {
              // Extract error message(s) from the payload
              let errMsg = body.message || 'An error occurred processing your request.';
              
              const errors = body.errors || body.error;
              if (Array.isArray(errors) && errors.length > 0) {
                // If there's an array of errors, join them
                errMsg = errors.map((e: any) => typeof e === 'string' ? e : e.message || 'Unknown error').join('\n');
              } else if (typeof errors === 'string') {
                errMsg = errors;
              }

              messageService.add({
                severity: 'error',
                summary: 'API Error',
                detail: errMsg,
                life: 5000
              });
            }
          }
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      // Handle actual HTTP failure responses (4xx, 5xx)
      if (!isExcluded) {
        let errSummary = 'Server Error';
        let errMsg = 'An unexpected error occurred. Please try again later.';

        if (error.status === 400) {
          errSummary = 'Bad Request';
          errMsg = error.error?.message || 'The request was invalid.';
          
          // Handle validation error arrays if present in 400
          if (error.error?.errors && Array.isArray(error.error.errors)) {
            errMsg = error.error.errors.map((e: any) => typeof e === 'string' ? e : e.message || '').join('\n');
          }
        } else if (error.status === 401) {
          errSummary = 'Unauthorized';
          errMsg = 'Your session has expired or you are not logged in.';
        } else if (error.status === 403) {
          errSummary = 'Access Denied';
          errMsg = 'You do not have permission to perform this action.';
        } else if (error.status === 404) {
          errSummary = 'Not Found';
          errMsg = 'The requested resource was not found.';
        } else if (error.status === 422) {
          errSummary = 'Validation Error';
          errMsg = error.error?.message || 'Please check your input data.';
          
          if (error.error?.errors && Array.isArray(error.error.errors)) {
             errMsg = error.error.errors.map((e: any) => typeof e === 'string' ? e : e.message || '').join('\n');
          }
        } else if (error.status >= 500) {
          errSummary = 'Internal Server Error';
          errMsg = 'The server encountered an error processing your request.';
        } else if (error.error instanceof ErrorEvent) {
          // Client-side/network error
          errSummary = 'Network Error';
          errMsg = 'Please check your internet connection.';
        }

        // Add toast for the HTTP error
        messageService.add({
          severity: 'error',
          summary: errSummary,
          detail: errMsg,
          life: 5000
        });
      }

      // Re-throw so caller can still catch via RxJS if needed
      return throwError(() => error);
    })
  );
};
