
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FileService {
  // Usar environment para apiUrl y apiKey

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';
    const headers = new HttpHeaders({
      'API_KEY': environment.apiKey,
      'Authorization': `Bearer ${apiToken}`
    });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId || '');
    return this.http.post(`${environment.apiUrl}/upload`, formData, { headers });
  }
}
