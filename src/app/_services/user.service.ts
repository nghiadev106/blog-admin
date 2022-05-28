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
export class UserService {
  private API_URL = `${environment.apiUrl}/users`;
  constructor(private readonly http: HttpClient) { }
  getAllPaging(data: any): Observable<any> {
    const url = `${this.API_URL}/paging?pageSize=${data.pageSize}&page=${data.page}&keyword=${data.keyword}`;
    return this.http.get<any>(url);
  }
  add(data: any): Observable<number> {
    const url = `${this.API_URL}/create`;
    var body = JSON.stringify(data);
    console.log(body);
    return this.http.post<any>(url, body, httpOptions);
  }
  getById(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  update(id: any, data: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    var body = JSON.stringify(data);
    return this.http.put<any>(url, body, httpOptions);
  }
  delete(id: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(url);
  }
}
