import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

// Add endpoints here that should NOT trigger the global loading spinner
const EXCLUDED_URLS: string[] = [
  // '/api/v1/notifications/polling',
  // '/api/v1/silent-health'
];

export const apiLoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Check if current URL is in the excluded list
  const isExcluded = EXCLUDED_URLS.some(url => req.url.includes(url));

  if (!isExcluded) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      if (!isExcluded) {
        loaderService.hide();
      }
    })
  );
};
