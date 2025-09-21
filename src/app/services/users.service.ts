
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  // Usar environment para apiUrl y apiKey

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey, 'Authorization': `Bearer ${apiToken}` });
    return this.http.get(`${environment.apiUrl}/users`, { headers });
  }

  createUser(user: any): Observable<any> {
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey, 'Authorization': `Bearer ${apiToken}` });
    return this.http.post(`${environment.apiUrl}/users`, user, { headers });
  }

  updateUser(id: string, user: any): Observable<any> {
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey, 'Authorization': `Bearer ${apiToken}` });
    return this.http.put(`${environment.apiUrl}/users/${id}`, user, { headers });
  }

  deleteUser(id: string): Observable<any> {
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey, 'Authorization': `Bearer ${apiToken}` });
    return this.http.delete(`${environment.apiUrl}/users/${id}`, { headers });
  }
}
