
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Usar environment para apiUrl y apiKey

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey });
    return this.http.post(`${environment.apiUrl}/login`, { email, password }, { headers });
  }

  logout(): Observable<any> {
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey });
    return this.http.post(`${environment.apiUrl}/logout`, { Authorization: `Bearer ${apiToken}` }, { headers });
  }
}
