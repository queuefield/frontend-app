import { Injectable, inject } from '@angular/core';
import { HttpService } from './http.service';
import { AppConfigService } from './app-config.service';
import { Observable, of, tap, map, shareReplay, catchError } from 'rxjs';

export enum LookupType {
  Categories = 'categories',
  Countries = 'countries',
  Regions = 'regions',
  Cities = 'cities',
  SalesAgents = 'salesAgents',
  SupportAgents = 'supportAgents',
  Plans = 'plans',
  Sources = 'sources',
  Statuses = 'statuses',
  Zones = 'zones'
}

@Injectable({
  providedIn: 'root'
})
export class LookupsService {
  private http = inject(HttpService);
  private configService = inject(AppConfigService);
  private readonly STORAGE_PREFIX = 'lookup_data_';
  private requestCache = new Map<string, Observable<any[]>>();

  // Map each lookup type to its specific API url.
  // Replace these placeholder URLs with your actual endpoints.
  private readonly URL_MAP: Record<LookupType, string> = {
    [LookupType.Categories]: '/api/v1/tenant/categories',
    [LookupType.Countries]: '/api/v1/country/active',
    [LookupType.Regions]: '/api/v1/region/by-country',
    [LookupType.Cities]: '/api/v1/city/by-region',
    [LookupType.SalesAgents]: '/api/v1/user/sales',
    [LookupType.SupportAgents]: '/api/v1/user/support',
    [LookupType.Plans]: '/api/v1/subscriptionplan/active',
    [LookupType.Sources]: '/api/v1/tenant/sources',
    [LookupType.Statuses]: '/api/v1/tenant/statues',
    [LookupType.Zones]: '/api/v1/tenant/statues'
  };

  private getApiUrl(lookupType: LookupType): string {
    return this.URL_MAP[lookupType];
  }

  /**
   * Gets lookup data. Checks local storage first, then API.
   * Caches the API response in localStorage for subsequent calls.
   */
  getLookup(lookupType: LookupType, parentId?: string | number): Observable<any[]> {
    const shouldCache = this.configService.isFeatureEnabled('cacheLookups');
    const cacheKey = this.STORAGE_PREFIX + lookupType + (parentId ? `_${parentId}` : '');
    const requestKey = lookupType + (parentId ? `_${parentId}` : '');

    // 1. Check local storage if caching is enabled
    if (shouldCache) {
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed)) {
            return of(parsed);
          }
        } catch (e) {
          // Ignore parse error and proceed to fetch
        }
      }
    }

    // 2. Check if a request is already in progress to avoid duplicate calls
    if (this.requestCache.has(requestKey)) {
      return this.requestCache.get(requestKey)!;
    }

    // 3. Fetch from API
    let url = this.getApiUrl(lookupType);
    if (parentId !== undefined && parentId !== null) {
      url = `${url}/${parentId}`;
    }

    const request$ = this.http.get<any>(url).pipe(
      map(res => res?.data || res || []),
      tap((data: any[]) => {
        // Store in local storage if caching is enabled
        if (shouldCache) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
        }
      }),
      catchError(err => {
        console.error(`Failed to fetch lookup: ${lookupType}`, err);
        return of([]);
      }),
      shareReplay(1)
    );

    this.requestCache.set(requestKey, request$);

    // Clear request cache after it completes so subsequent hard-refreshes work
    request$.subscribe({
      next: () => this.requestCache.delete(requestKey),
      error: () => this.requestCache.delete(requestKey)
    });

    return request$;
  }

  /**
   * Clears a specific lookup from local storage
   */
  clearLookup(lookupType: LookupType): void {
    localStorage.removeItem(this.STORAGE_PREFIX + lookupType);
  }

  /**
   * Clears all lookups from local storage
   */
  clearAllLookups(): void {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  }
}
