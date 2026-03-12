import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  private http = inject(HttpService);

  private readonly BASE = '/api/v1/tenant';

  /** Create a new tenant (store) */
  create(payload: any): Observable<any> {
    return this.http.post(this.BASE, payload);
  }

  /** Update an existing tenant */
  update(id: number, payload: any): Observable<any> {
    return this.http.put(`${this.BASE}/${id}`, payload);
  }

  /** Get a tenant by ID */
  getById(id: number): Observable<any> {
    return this.http.get(`${this.BASE}/${id}`);
  }
}
