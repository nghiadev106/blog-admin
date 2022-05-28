import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private API_URL = `${environment.apiUrl}/dashboards`;
  constructor(private readonly http: HttpClient) { }
  get() {
    const url = `${this.API_URL}`;
    return this.http.get<any>(url);
  }
}
