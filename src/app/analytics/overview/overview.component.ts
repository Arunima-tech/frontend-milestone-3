import { Component, OnInit, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { MockAnalyticsService } from '../analytics.mock.service';
import { DateRangePickerComponent } from '../../shared/components/date-range-picker/date-range-picker.component';
import { LineChartComponent, LineDataset } from '../../shared/components/line-chart/line-chart.component';
import { DoughnutChartComponent } from '../../shared/components/doughnut-chart/doughnut-chart.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    NgClass,
    DateRangePickerComponent,
    LineChartComponent,
    DoughnutChartComponent
  ],
  template: `
    <div class="admin-analytics-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span>Home</span>
        <span class="chevron">&gt;</span>
        <span class="current">Analytics</span>
      </div>

      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Admin Analytics Dashboard</h1>
          <p class="page-subtitle">Overview of platform statistics and key insights</p>
        </div>
        <div class="header-right">
          <app-date-range-picker />
        </div>
      </div>

      <!-- Top 8 Metric Cards Grid -->
      <div class="top-cards-grid">
        <!-- 1. Total Users -->
        <div class="metric-card">
          <div class="card-icon-circle blue">
            <span class="material-icons">people</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Users</span>
            <div class="card-value-row">
              <span class="card-value">5,820</span>
            </div>
            <span class="card-trend green">↑ 12% <span class="trend-sub">from last month</span></span>
          </div>
        </div>

        <!-- 2. Total Policies -->
        <div class="metric-card">
          <div class="card-icon-circle purple">
            <span class="material-icons">description</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Policies</span>
            <div class="card-value-row">
              <span class="card-value">1,250</span>
            </div>
            <span class="card-trend green">↑ 8% <span class="trend-sub">from last month</span></span>
          </div>
        </div>

        <!-- 3. Total Schemes -->
        <div class="metric-card">
          <div class="card-icon-circle green">
            <span class="material-icons">folder</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Schemes</span>
            <div class="card-value-row">
              <span class="card-value">438</span>
            </div>
            <span class="card-trend green">↑ 15% <span class="trend-sub">from last month</span></span>
          </div>
        </div>

        <!-- 4. Approved Policies -->
        <div class="metric-card">
          <div class="card-icon-circle green-check">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="card-content">
            <span class="card-label">Approved Policies</span>
            <div class="card-value-row">
              <span class="card-value">1,020</span>
            </div>
            <span class="card-trend green">↑ 10% <span class="trend-sub">from last month</span></span>
          </div>
        </div>

        <!-- 5. Pending Policies -->
        <div class="metric-card">
          <div class="card-icon-circle orange">
            <span class="material-icons">schedule</span>
          </div>
          <div class="card-content">
            <span class="card-label">Pending Policies</span>
            <div class="card-value-row">
              <span class="card-value">85</span>
            </div>
            <span class="card-trend red">↑ 5% <span class="trend-sub">from last month</span></span>
          </div>
        </div>

        <!-- 6. Rejected Policies -->
        <div class="metric-card">
          <div class="card-icon-circle red">
            <span class="material-icons">close</span>
          </div>
          <div class="card-content">
            <span class="card-label">Rejected Policies</span>
            <div class="card-value-row">
              <span class="card-value">42</span>
            </div>
            <span class="card-trend green">↓ 12% <span class="trend-sub">from last month</span></span>
          </div>
        </div>

        <!-- 7. Active Schemes -->
        <div class="metric-card">
          <div class="card-icon-circle blue-gear">
            <span class="material-icons">settings</span>
          </div>
          <div class="card-content">
            <span class="card-label">Active Schemes</span>
            <div class="card-value-row">
              <span class="card-value">390</span>
            </div>
            <span class="card-trend green">↑ 18% <span class="trend-sub">from last month</span></span>
          </div>
        </div>

        <!-- 8. Total Notifications -->
        <div class="metric-card">
          <div class="card-icon-circle red-bell">
            <span class="material-icons">notifications</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Notifications</span>
            <div class="card-value-row">
              <span class="card-value">12,600</span>
            </div>
            <span class="card-trend green">↑ 25% <span class="trend-sub">from last month</span></span>
          </div>
        </div>
      </div>

      <!-- Charts Row (3 cards) -->
      <div class="charts-row">
        <!-- Policies Trend Line Chart -->
        <div class="chart-card flex-2">
          <div class="card-header-row">
            <h3 class="card-title">Policies Trend</h3>
            <div class="time-filter">
              <span>Last 9 Months</span>
              <span class="material-icons">expand_more</span>
            </div>
          </div>
          <app-line-chart
            [labels]="trendLabels"
            [datasets]="policiesTrendDatasets"
            [yMin]="0"
            [yMax]="200"
          />
        </div>

        <!-- Schemes by Category Doughnut Chart -->
        <div class="chart-card flex-1">
          <h3 class="card-title">Schemes by Category</h3>
          <app-doughnut-chart
            [labels]="schemesCategoryLabels"
            [data]="schemesCategoryData"
            [colors]="['#3cb371', '#2f6fed', '#06b6d4', '#f5a524', '#e5484d', '#94a3b8']"
            centerMainText="438"
            centerSubText="Total"
          />
        </div>

        <!-- User Distribution Doughnut Chart -->
        <div class="chart-card flex-1">
          <h3 class="card-title">User Distribution</h3>
          <app-doughnut-chart
            [labels]="userDistLabels"
            [data]="userDistData"
            [colors]="['#2f6fed', '#3cb371', '#8b5cf6', '#f5a524', '#e5484d']"
            centerMainText="5,820"
            centerSubText="Users"
          />
        </div>
      </div>

      <!-- Tables Row (2 cards) -->
      <div class="tables-row">
        <!-- Recent User Activity Table -->
        <div class="table-card">
          <div class="table-header-row">
            <h3 class="card-title">Recent User Activity</h3>
            <a href="javascript:void(0)" class="link-view-all">View All</a>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (item of recentActivities; track item.user) {
                  <tr>
                    <td class="text-user">{{ item.user }}</td>
                    <td class="text-action">{{ item.action }}</td>
                    <td class="text-muted">{{ item.time }}</td>
                    <td>
                      <span class="badge-success">{{ item.status }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Latest Notifications Table -->
        <div class="table-card">
          <div class="table-header-row">
            <h3 class="card-title">Latest Notifications</h3>
            <a href="javascript:void(0)" class="link-view-all">View All</a>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (item of notifications; track item.title) {
                  <tr>
                    <td class="text-user">{{ item.title }}</td>
                    <td>
                      <span class="badge-type" [ngClass]="item.typeClass">{{ item.type }}</span>
                    </td>
                    <td class="text-muted">{{ item.date }}</td>
                    <td>
                      <span class="badge-success">{{ item.status }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './overview.component.scss'
})
export class OverviewComponent implements OnInit {
  private api = inject(MockAnalyticsService);

  // Policies Trend Line Chart Data (Jan - Sep)
  trendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  policiesTrendDatasets: LineDataset[] = [
    {
      label: 'Approved',
      data: [75, 85, 112, 118, 125, 108, 115, 120, 140, 160],
      borderColor: '#3cb371'
    },
    {
      label: 'Pending',
      data: [35, 40, 42, 45, 48, 42, 40, 38, 45],
      borderColor: '#f5a524'
    },
    {
      label: 'Rejected',
      data: [12, 14, 12, 15, 10, 12, 11, 10, 10],
      borderColor: '#e5484d'
    }
  ];

  // Schemes by Category
  schemesCategoryLabels = [
    'Agriculture (28%)',
    'Education (18%)',
    'Healthcare (15%)',
    'Social Welfare (12%)',
    'Employment (10%)',
    'Others (17%)'
  ];
  schemesCategoryData = [28, 18, 15, 12, 10, 17];

  // User Distribution
  userDistLabels = [
    'Citizens (77%)',
    'Government Officials (11%)',
    'Researchers (7%)',
    'Organizations (5%)',
    'Administrators (1%)'
  ];
  userDistData = [77, 11, 7, 5, 1];

  // Recent User Activity Data
  recentActivities = [
    { user: 'john.doe@example.com', action: 'Logged in', time: '2 minutes ago', status: 'Success' },
    { user: 'priya.singh@gov.in', action: 'Searched schemes', time: '5 minutes ago', status: 'Success' },
    { user: 'rahul.kumar@example.com', action: 'Viewed policy', time: '12 minutes ago', status: 'Success' },
    { user: 'meera.sharma@org.in', action: 'Downloaded document', time: '18 minutes ago', status: 'Success' },
    { user: 'amit.patel@example.com', action: 'Submitted feedback', time: '25 minutes ago', status: 'Success' }
  ];

  // Latest Notifications Data
  notifications = [
    { title: 'New Agriculture Scheme Launched', type: 'Scheme Update', typeClass: 'blue', date: '2 hours ago', status: 'Sent' },
    { title: 'Policy Amendment Notification', type: 'Policy Alert', typeClass: 'purple', date: '5 hours ago', status: 'Sent' },
    { title: 'Application Deadline Reminder', type: 'Deadline Reminder', typeClass: 'orange', date: '1 day ago', status: 'Sent' },
    { title: 'New Guidelines Published', type: 'Policy Update', typeClass: 'purple', date: '2 days ago', status: 'Sent' },
    { title: 'System Maintenance Notice', type: 'System Alert', typeClass: 'red', date: '3 days ago', status: 'Sent' }
  ];

  ngOnInit(): void {
    this.api.getAdminAnalytics().subscribe();
  }
}
