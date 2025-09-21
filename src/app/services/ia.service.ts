
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interfaces para tipar las respuestas
export interface AnalysisRequest {
  startDate: string;
  endDate: string;
  adSetName?: string;
}

export interface AnalysisSummary {
  TotalSpent: number;
  TotalReach: number;
  TotalImpressions: number;
  TotalResults: number;
  AdSetCount: number;
  CostPerResult: number;
}

export interface AnalysisResponse {
  Analysis: string;
  HasAnalysis: boolean;
  Summary: AnalysisSummary;
  AvailableAdSets: string[];
  StartDate: string;
  EndDate: string;
  SelectedAdSet: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class IaAnalysisService {
  // Usar environment para apiUrl y apiKey

  constructor(private http: HttpClient) {}

  generateAnalysis(filters: AnalysisRequest): Observable<AnalysisResponse> {
    const url = `${environment.apiUrl}/dashboard/generate-analysis`;

    const headers = new HttpHeaders({
      'API_KEY': environment.apiKey,
      'Content-Type': 'application/json'
    });

     const payload = {
      startDate: filters.startDate,
      endDate: filters.endDate,
      ...(filters.adSetName && { adSetName: filters.adSetName }) 
    };

    return this.http.post<AnalysisResponse>(url, payload, { headers });
  }
}
