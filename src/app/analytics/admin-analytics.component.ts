import { Component, inject } from '@angular/core';
import { MockAnalyticsService } from './analytics.mock.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  template: `
    <div class="admin-analytics" style="padding: 2rem;">
      <h2>Admin Analytics</h2>
      <p>System-wide metrics and usage statistics.</p>
    </div>
  `
})
export class AdminAnalyticsComponent {
  private api = inject(MockAnalyticsService);
}
