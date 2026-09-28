import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);

  getAdminAnalytics(dateRange?: any): Observable<any> {
    return this.http.get('/api/analytics/admin', { params: dateRange });
  }

  getDepartmentAnalytics(dateRange?: any): Observable<any> {
    return this.http.get('/api/analytics/department', { params: dateRange });
  }

  downloadReport(format: string = 'pdf', dateRange?: any): Observable<Blob> {
    return this.http.get('/api/analytics/report/download', {
      params: { format, ...dateRange },
      responseType: 'blob'
    });
  }
}
