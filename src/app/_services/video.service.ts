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
export class VideoService {
  private API_URL = `${environment.apiUrl}/videos`;
  constructor(private readonly http: HttpClient) { }
  getAll() {
    const url = `${this.API_URL}`;
    return this.http.get<any>(url);
  }
  getAllPaging(data: any): Observable<any> {
    const url = `${this.API_URL}/paging?pageSize=${data.pageSize}&page=${data.page}&keyword=${data.keyword}`;
    return this.http.get<any>(url);
  }
  add(video: any): Observable<number> {
    const url = `${this.API_URL}`;
    var body = JSON.stringify(video);
    return this.http.post<any>(url, body, httpOptions);
  }
  getById(id: any): Observable<any> {
    const url = `${this.API_URL}/${id}`;
    return this.http.get<any>(url);
  }
  update(id: any, video: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    var body = JSON.stringify(video);
    return this.http.put<any>(url, body, httpOptions);
  }
  delete(id: any): Observable<number> {
    const url = `${this.API_URL}/${id}`;
    return this.http.delete<any>(url);
  }
}
