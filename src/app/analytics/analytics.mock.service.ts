import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockAnalyticsService {
  getAdminAnalytics(_range?: unknown): Observable<any> {
    return of({
      totalUsers: 1420,
      activePolicies: 85,
      totalSchemes: 42,
      usageStats: [
        { month: 'Jan', queries: 400 },
        { month: 'Feb', queries: 600 },
        { month: 'Mar', queries: 800 }
      ]
    });
  }

  getDepartmentAnalytics(_range?: unknown): Observable<any> {
    return of({
      departments: [
        { name: 'Health & Family Welfare', queries: 1250, policiesCount: 14 },
        { name: 'Education & Literacy', queries: 980, policiesCount: 22 },
        { name: 'Agriculture & Farmers Welfare', queries: 870, policiesCount: 18 }
      ]
    });
  }

  downloadReport(format: 'pdf' | 'xlsx', _range?: unknown): Observable<Blob> {
    return of(new Blob(['Mock report'], { type: 'text/plain' }));
  }
}
