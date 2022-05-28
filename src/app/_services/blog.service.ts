import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private API_URL = `${environment.apiUrl}/blogs`;
  constructor(private readonly http: HttpClient) { }
  getAll() {
    const url = `${this.API_URL}`;
    return this.http.get<any>(url);
  }

  getNew() {
    const url = `${this.API_URL}/new`;
    return this.http.get<any>(url);
  }
  getAllPaging(data: any): Observable<any> {
    const url = `${this.API_URL}/paging?pageSize=${data.pageSize}&page=${data.page}&keyword=${data.keyword}&categoryId=${data.categoryId}`;
    return this.http.get<any>(url);
  }
  add(category: any): Observable<number> {
    const url = `${this.API_URL}`;
    var body = JSON.stringify(category);
    return this.http.post<any>(url, body, httpOptions);
  }
  getById(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  update(id: any, category: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    var body = JSON.stringify(category);
    return this.http.put<any>(url, body, httpOptions);
  }
  delete(id: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(url);
  }
}
