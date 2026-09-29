import { Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { DepartmentAnalyticsComponent } from './department-analytics.component';
import { AdminAnalyticsComponent } from './admin-analytics.component';

export const ANALYTICS_ROUTES: Routes = [
  { path: 'overview', component: OverviewComponent },
  { path: 'admin', component: AdminAnalyticsComponent },
  { path: 'departments', component: DepartmentAnalyticsComponent },
  { path: 'policies', loadComponent: () => import('./policy-analytics.component').then(m => m.PolicyAnalyticsComponent) },
  { path: 'schemes', loadComponent: () => import('./scheme-analytics.component').then(m => m.SchemeAnalyticsComponent) },
  { path: '', redirectTo: 'overview', pathMatch: 'full' }
];
