
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar si el usuario ya está autenticado al iniciar
    this.checkAuthStatus();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 
      'API_KEY': environment.apiKey,
      'Content-Type': 'application/json'
    });
    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, 
      { email, password }, 
      { headers }
    );
  }

  logout(): Observable<any> {
    const apiToken = this.getToken();
    const headers = new HttpHeaders({ 
      'API_KEY': environment.apiKey,
      'Authorization': `Bearer ${apiToken}`
    });
    return this.http.post(`${environment.apiUrl}/logout`, {}, { headers });
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      this.isLoggedInSubject.next(true);
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      this.isLoggedInSubject.next(false);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private checkAuthStatus(): void {
    this.isLoggedInSubject.next(this.isAuthenticated());
  }
}
