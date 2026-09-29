import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
export class MockAnalyticsService {
  getAdminAnalytics(_range?: unknown): Observable<any> {
    return of({
      totalUsers: 5820,
      activePolicies: 1250,
      totalSchemes: 438,
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

  // Policy Analytics Methods
  getPolicyAnalyticsStats(_filters?: any): Observable<AnalyticsStat[]> {
    return of([
      { label: 'Total Policies', value: '1,250', change: '+8%', isPositive: true },
      { label: 'Approved Policies', value: '1,020', change: '+10%', isPositive: true },
      { label: 'Pending Policies', value: '85', change: '-5%', isPositive: true, goodWhenDown: true },
      { label: 'Rejected Policies', value: '42', change: '-12%', isPositive: true, goodWhenDown: true },
      { label: 'Archived Policies', value: '103', change: '+6%', isPositive: true }
    ]);
  }

  getPoliciesByCategory(_filters?: any): Observable<CategorySlice[]> {
    return of([
      { label: 'Education', percentage: 18 },
      { label: 'Healthcare', percentage: 15 },
      { label: 'Agriculture', percentage: 14 },
      { label: 'Employment', percentage: 12 },
      { label: 'Finance', percentage: 10 },
      { label: 'Environment', percentage: 8 },
      { label: 'Housing', percentage: 8 },
      { label: 'Others', percentage: 15 }
    ]);
  }

  getPolicyStatusTrend(_filters?: any): Observable<TrendData> {
    return of({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        { label: 'Approved', data: [100, 110, 125, 130, 140, 135, 145, 150, 160, 165, 170, 175], color: '#3cb371' },
        { label: 'Pending', data: [85, 90, 80, 75, 70, 65, 60, 55, 50, 48, 46, 45], color: '#f5a524' },
        { label: 'Rejected', data: [25, 24, 22, 20, 18, 16, 15, 14, 12, 11, 10, 10], color: '#e5484d' },
        { label: 'Archived', data: [5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 10], color: '#2f6fed' }
      ]
    });
  }

  getPoliciesByState(_filters?: any): Observable<BarChartData[]> {
    return of([
      { label: 'Uttar Pradesh', value: 180 },
      { label: 'Maharashtra', value: 150 },
      { label: 'Bihar', value: 120 },
      { label: 'West Bengal', value: 110 },
      { label: 'Madhya Pradesh', value: 95 },
      { label: 'Rajasthan', value: 80 },
      { label: 'Tamil Nadu', value: 75 },
      { label: 'Gujarat', value: 70 },
      { label: 'Karnataka', value: 65 },
      { label: 'Others', value: 105 }
    ]);
  }

  getPoliciesByMinistry(_filters?: any): Observable<BarChartData[]> {
    return of([
      { label: 'Education', value: 180 },
      { label: 'Health', value: 140 },
      { label: 'Agriculture', value: 120 },
      { label: 'Finance', value: 100 },
      { label: 'Home Affairs', value: 90 },
      { label: 'Rural Dev', value: 80 },
      { label: 'Environment', value: 70 },
      { label: 'Skill Dev', value: 60 },
      { label: 'Women & Child', value: 50 },
      { label: 'Others', value: 40 }
    ]);
  }

  getLatestPolicies(_filters?: any): Observable<PolicyRow[]> {
    return of([
      { title: 'National Education Policy 2024', ministry: 'Ministry of Education', state: 'All India', category: 'Education', status: 'Approved', date: 'Sep 28, 2024' },
      { title: 'Digital Agriculture Mission', ministry: 'Ministry of Agriculture', state: 'All India', category: 'Agriculture', status: 'Approved', date: 'Sep 25, 2024' },
      { title: 'Clean Air Rural Initiative', ministry: 'Ministry of Environment', state: 'Uttar Pradesh', category: 'Environment', status: 'Pending', date: 'Sep 22, 2024' },
      { title: 'Urban Housing Subsidy Norms', ministry: 'Ministry of Housing', state: 'Maharashtra', category: 'Housing', status: 'Rejected', date: 'Sep 20, 2024' },
      { title: 'National Apprenticeship Scheme', ministry: 'Ministry of Skill Dev', state: 'Delhi', category: 'Employment', status: 'Approved', date: 'Sep 18, 2024' }
    ]);
  }

  // Scheme Analytics Methods
  getSchemeAnalyticsStats(_filters?: any): Observable<AnalyticsStat[]> {
    return of([
      { label: 'Total Schemes', value: '438', change: '+15%', isPositive: true },
      { label: 'Active Schemes', value: '390', change: '+18%', isPositive: true },
      { label: 'Pending Schemes', value: '28', change: '-5%', isPositive: true, goodWhenDown: true },
      { label: 'Rejected Schemes', value: '10', change: '-12%', isPositive: true, goodWhenDown: true },
      { label: 'Archived Schemes', value: '10', change: '+8%', isPositive: true }
    ]);
  }

  getSchemesByCategoryDetailed(_filters?: any): Observable<CategorySlice[]> {
    return of([
      { label: 'Scholarships', percentage: 18 },
      { label: 'Farmer Welfare', percentage: 16 },
      { label: 'Healthcare', percentage: 14 },
      { label: 'Housing', percentage: 12 },
      { label: 'Business Support', percentage: 10 },
      { label: 'Employment Programs', percentage: 8 },
      { label: 'Women Empowerment', percentage: 8 },
      { label: 'Senior Citizen Welfare', percentage: 7 },
      { label: 'Social Security', percentage: 7 }
    ]);
  }

  getSchemeTrend(_filters?: any): Observable<TrendData> {
    return of({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      series: [
        { label: 'New Schemes', data: [35, 36, 38, 40, 42, 41, 43, 44, 45, 44, 45, 45], color: '#3cb371' },
        { label: 'Active Schemes', data: [40, 45, 50, 55, 60, 65, 70, 75, 78, 80, 82, 85], color: '#2f6fed' },
        { label: 'Closed/Archived', data: [30, 28, 25, 22, 20, 18, 16, 15, 14, 12, 11, 10], color: '#f5a524' }
      ]
    });
  }

  getSchemesByState(_filters?: any): Observable<BarChartData[]> {
    return of([
      { label: 'Uttar Pradesh', value: 72 },
      { label: 'Maharashtra', value: 58 },
      { label: 'Bihar', value: 46 },
      { label: 'West Bengal', value: 38 },
      { label: 'Madhya Pradesh', value: 32 },
      { label: 'Rajasthan', value: 28 },
      { label: 'Tamil Nadu', value: 26 },
      { label: 'Gujarat', value: 24 },
      { label: 'Karnataka', value: 22 },
      { label: 'Others', value: 48 }
    ]);
  }

  getTopViewedSchemes(_filters?: any): Observable<SchemeRow[]> {
    return of([
      { rank: 1, name: 'PM Kisan Samman Nidhi', ministry: 'Ministry of Agriculture', views: 12450, applications: 3210 },
      { rank: 2, name: 'Ayushman Bharat PM-JAY', ministry: 'Ministry of Health', views: 10890, applications: 2840 },
      { rank: 3, name: 'PM Awas Yojana (Urban)', ministry: 'Ministry of Housing', views: 9540, applications: 2150 },
      { rank: 4, name: 'National Means-cum-Merit Scholarship', ministry: 'Ministry of Education', views: 8720, applications: 1920 },
      { rank: 5, name: 'PM Mudra Yojana', ministry: 'Ministry of Finance', views: 7890, applications: 1650 }
    ]);
  }

  getRecentSchemeUpdates(_filters?: any): Observable<SchemeUpdateRow[]> {
    return of([
      { title: 'New Subsidy Guidelines for Farmers', ministry: 'Agriculture', type: 'Update', date: 'Sep 28 2024', status: 'Active' },
      { title: 'Scholarship Application Deadline Extended', ministry: 'Education', type: 'Notification', date: 'Sep 27 2024', status: 'Active' },
      { title: 'PM Vishwakarma Scheme Revision', ministry: 'Skill Dev', type: 'New Scheme', date: 'Sep 25 2024', status: 'Active' },
      { title: 'Health Insurance Coverage Expansion', ministry: 'Health', type: 'Update', date: 'Sep 24 2024', status: 'Active' },
      { title: 'Solar Rooftop Subsidy Portal Live', ministry: 'Renewable Energy', type: 'Notification', date: 'Sep 22 2024', status: 'Active' }
    ]);
  }
}
