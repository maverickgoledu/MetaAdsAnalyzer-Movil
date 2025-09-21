
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DashboardData {
  StartDate: string | null;
  EndDate: string | null;
  SelectedAdSet: string | null;
  AvailableAdSets: string[];
  UltimaCarga: string | null;
  TotalImporteGastado: number;
  TotalAlcance: number;
  TotalImpresiones: number;
  TotalResultados: number;
  CostoPromedioResultado: number;
  AlcanceVsImpresiones: number;
  TasaConversion: number;
  CostoPorMilImpresiones: number;
  PresupuestoDiarioPorConjunto: { [key: string]: number };
  ImporteGastadoPorConjunto: { [key: string]: number };
}

export interface MonthlyData {
  ImporteGastado: number[];
  Alcance: number[];
  Impresiones: number[];
  Resultados: number[];
}

export interface AdSetsData {
  ImporteGastado: { [key: string]: number };
  Alcance: { [key: string]: number };
  Impresiones: { [key: string]: number };
  Resultados: { [key: string]: number };
  CostoPorResultado: { [key: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getAdSets(params: any = {}): Observable<string[]> {
    const url = `${environment.apiUrl}/dashboard/adsets`;
    return this.http.get<string[]>(url, { params });
  }
  // Usar environment para apiUrl y apiKey

  // ...existing code...

  getDashboardData(filters?: { startDate?: string; endDate?: string; adSetName?: string }): Observable<DashboardData> {
    let params = new HttpParams();
    if (filters?.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters?.endDate) {
      params = params.set('endDate', filters.endDate);
    }
    if (filters?.adSetName) {
      params = params.set('adSetName', filters.adSetName);
    }
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey, 'Authorization': `Bearer ${apiToken}` });
    return this.http.get<DashboardData>(`${environment.apiUrl}/dashboard`, { params, headers });
  }

  getMonthlyData(year?: number): Observable<MonthlyData> {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey, 'Authorization': `Bearer ${apiToken}` });
    return this.http.get<MonthlyData>(`${environment.apiUrl}/dashboard/monthly`, { params, headers });
  }

  getAdSetsData(): Observable<AdSetsData> {
    const apiToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({ 'API_KEY': environment.apiKey, 'Authorization': `Bearer ${apiToken}` });
    return this.http.get<AdSetsData>(`${environment.apiUrl}/dashboard/adsets`, { headers });
  }
}
