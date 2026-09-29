import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AnalyticsStat,
  CategorySlice,
  TrendData,
  BarChartData,
  PolicyRow,
  SchemeRow,
  SchemeUpdateRow
} from './analytics.models';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private http = inject(HttpClient);

  getAdminAnalytics(filters?: any): Observable<any> {
    return this.http.get('/api/analytics/admin', { params: filters });
  }

  getDepartmentAnalytics(filters?: any): Observable<any> {
    return this.http.get('/api/analytics/department', { params: filters });
  }

  downloadReport(format: 'pdf' | 'xlsx' = 'pdf', filters?: any): Observable<Blob> {
    return this.http.get('/api/analytics/report/download', {
      params: { format, ...filters },
      responseType: 'blob'
    });
  }

  // Policy Analytics
  getPolicyAnalyticsStats(filters?: any): Observable<AnalyticsStat[]> {
    return this.http.get<AnalyticsStat[]>('/api/analytics/policies/stats', { params: filters });
  }

  getPoliciesByCategory(filters?: any): Observable<CategorySlice[]> {
    return this.http.get<CategorySlice[]>('/api/analytics/policies/categories', { params: filters });
  }

  getPolicyStatusTrend(filters?: any): Observable<TrendData> {
    return this.http.get<TrendData>('/api/analytics/policies/trend', { params: filters });
  }

  getPoliciesByState(filters?: any): Observable<BarChartData[]> {
    return this.http.get<BarChartData[]>('/api/analytics/policies/by-state', { params: filters });
  }

  getPoliciesByMinistry(filters?: any): Observable<BarChartData[]> {
    return this.http.get<BarChartData[]>('/api/analytics/policies/by-ministry', { params: filters });
  }

  getLatestPolicies(filters?: any): Observable<PolicyRow[]> {
    return this.http.get<PolicyRow[]>('/api/analytics/policies/latest', { params: filters });
  }

  // Scheme Analytics
  getSchemeAnalyticsStats(filters?: any): Observable<AnalyticsStat[]> {
    return this.http.get<AnalyticsStat[]>('/api/analytics/schemes/stats', { params: filters });
  }

  getSchemesByCategoryDetailed(filters?: any): Observable<CategorySlice[]> {
    return this.http.get<CategorySlice[]>('/api/analytics/schemes/categories', { params: filters });
  }

  getSchemeTrend(filters?: any): Observable<TrendData> {
    return this.http.get<TrendData>('/api/analytics/schemes/trend', { params: filters });
  }

  getSchemesByState(filters?: any): Observable<BarChartData[]> {
    return this.http.get<BarChartData[]>('/api/analytics/schemes/by-state', { params: filters });
  }

  getTopViewedSchemes(filters?: any): Observable<SchemeRow[]> {
    return this.http.get<SchemeRow[]>('/api/analytics/schemes/top-viewed', { params: filters });
  }

  getRecentSchemeUpdates(filters?: any): Observable<SchemeUpdateRow[]> {
    return this.http.get<SchemeUpdateRow[]>('/api/analytics/schemes/recent-updates', { params: filters });
  }
}
