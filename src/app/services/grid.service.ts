import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import {
  GridPayload,
  GridResponse,
  ChoiceDropdownPayload,
  HTTPMethods,
} from '../models/grid.model';

/**
 * Service that handles all HTTP calls for the shared grid component.
 * Wraps the existing HttpService.
 */
@Injectable({
  providedIn: 'root',
})
export class GridService {
  private http = inject(HttpService);

  /**
   * Fetch all data at once for CLIENT mode via GET.
   */
  fetchClientDataGet<T = any>(url: string): Observable<GridResponse<T>> {
    return this.http.get<GridResponse<T>>(url);
  }

  /**
   * Fetch all data at once for CLIENT mode via POST (empty body).
   */
  fetchClientDataPost<T = any>(url: string, body: any = {}): Observable<GridResponse<T>> {
    return this.http.post<GridResponse<T>>(url, body);
  }

  /**
   * Fetch a page of data for LAZY (server-side) mode.
   */
  fetchLazyData<T = any>(url: string, payload: GridPayload): Observable<GridResponse<T>> {
    return this.http.post<GridResponse<T>>(url, payload);
  }

  /**
   * Fetch dropdown options for `select` filter type.
   */
  fetchDropdownOptions(
    url: string,
    method: HTTPMethods = HTTPMethods.getReq,
    params?: string
  ): Observable<any> {
    switch (method) {
      case HTTPMethods.getReq:
        return this.http.get<any>(url);
      case HTTPMethods.postReq:
        return this.http.post<any>(url, {});
      case HTTPMethods.postReqWithUrlHeader:
        return this.http.post<any>(url, params ?? '');
      default:
        return this.http.get<any>(url);
    }
  }

  /**
   * Fetch options for `choice` filter type (server-side paginated search).
   */
  fetchChoiceOptions(url: string, payload: ChoiceDropdownPayload): Observable<any> {
    return this.http.post<any>(url, payload);
  }
}
