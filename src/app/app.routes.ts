import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'analytics', loadChildren: () => import('./analytics/analytics.routes').then(m => m.ANALYTICS_ROUTES) },
      { path: '', redirectTo: 'analytics/overview', pathMatch: 'full' }
    ]
  }
];
