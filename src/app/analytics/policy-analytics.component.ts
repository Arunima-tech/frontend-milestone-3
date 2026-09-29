import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { MockAnalyticsService } from './analytics.mock.service';
import {
  AnalyticsStat,
  CategorySlice,
  TrendData,
  BarChartData,
  PolicyRow
} from './analytics.models';
import { DateRangePickerComponent } from '../shared/components/date-range-picker/date-range-picker.component';
import { FiltersBarComponent } from './shared/filters-bar.component';
import { HbarChartComponent } from '../shared/components/hbar-chart/hbar-chart.component';
import { VbarChartComponent } from './shared/vbar-chart.component';
import { LineChartComponent, LineDataset } from '../shared/components/line-chart/line-chart.component';
import { DoughnutChartComponent } from '../shared/components/doughnut-chart/doughnut-chart.component';

@Component({
  selector: 'app-policy-analytics',
  standalone: true,
  imports: [
    NgClass,
    DateRangePickerComponent,
    FiltersBarComponent,
    HbarChartComponent,
    VbarChartComponent,
    LineChartComponent,
    DoughnutChartComponent
  ],
  template: `
    <div class="policy-analytics-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span>Home</span>
        <span class="chevron">&gt;</span>
        <span>Analytics</span>
        <span class="chevron">&gt;</span>
        <span class="current">Policy Analytics</span>
      </div>

      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Policy Analytics</h1>
          <p class="page-subtitle">Detailed insights into government policies</p>
        </div>
        <div class="header-right">
          <button type="button" class="btn-export" (click)="exportReport()">
            <span class="material-icons">file_download</span>
            Export Report
          </button>
          <app-date-range-picker />
        </div>
      </div>

      <!-- Filters Bar -->
      <app-filters-bar
        (apply)="onApplyFilters($event)"
        (reset)="onResetFilters()"
      />

      <!-- 5 Stat Cards Row -->
      <div class="stats-row">
        @for (stat of stats(); track stat.label; let i = $index) {
          <div class="stat-card">
            <div class="card-icon-circle" [ngClass]="getStatIconClass(i)">
              <span class="material-icons">{{ getStatIcon(i) }}</span>
            </div>
            <div class="card-content">
              <span class="card-label">{{ stat.label }}</span>
              <div class="card-value-row">
                <span class="card-value">{{ stat.value }}</span>
              </div>
              <span class="card-trend" [ngClass]="{ 'green': stat.isPositive, 'red': !stat.isPositive }">
                {{ stat.change }} <span class="trend-sub">from last month</span>
              </span>
            </div>
          </div>
        }
      </div>

      <!-- Row of 3 Chart Cards -->
      <div class="charts-three-row">
        <!-- Card 1: Policies by Category -->
        <div class="chart-card">
          <h3 class="card-title">Policies by Category</h3>
          <app-doughnut-chart
            [labels]="categoryLabels()"
            [data]="categoryData()"
            [colors]="['#2f6fed', '#3cb371', '#06b6d4', '#f5a524', '#8b5cf6', '#e5484d', '#14b8a6', '#94a3b8']"
            centerMainText="1,250"
            centerSubText="Policies"
          />
        </div>

        <!-- Card 2: Policy Status Trend -->
        <div class="chart-card flex-grow-1">
          <div class="card-header-row">
            <h3 class="card-title">Policy Status Trend</h3>
            <div class="badge-filter">
              <span>Last 12 Months</span>
              <span class="material-icons">expand_more</span>
            </div>
          </div>
          <app-line-chart
            [labels]="trendLabels()"
            [datasets]="trendDatasets()"
            [yMin]="0"
            [yMax]="200"
          />
        </div>

        <!-- Card 3: Policies by State -->
        <div class="chart-card">
          <div class="card-header-row">
            <h3 class="card-title">Policies by State</h3>
            <div class="badge-filter">
              <span>Top 10 States</span>
            </div>
          </div>
          <app-hbar-chart
            [labels]="stateLabels()"
            [data]="stateData()"
            selectedDepartment="All Departments"
            primaryColor="#2f6fed"
          />
        </div>
      </div>

      <!-- Row of 2 Cards: Ministry Chart + Latest Policies Table -->
      <div class="charts-two-row">
        <!-- Policies by Ministry -->
        <div class="chart-card flex-1">
          <div class="card-header-row">
            <h3 class="card-title">Policies by Ministry</h3>
            <div class="badge-filter">
              <span>Top 10 Ministries</span>
            </div>
          </div>
          <app-vbar-chart
            [labels]="ministryLabels()"
            [values]="ministryData()"
            color="#2f6fed"
          />
        </div>

        <!-- Latest Policies Table -->
        <div class="table-card flex-1">
          <div class="table-header-row">
            <h3 class="card-title">Latest Policies</h3>
            <a href="javascript:void(0)" class="link-view-all">View All</a>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Ministry</th>
                  <th>State</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (policy of latestPolicies(); track policy.title; let idx = $index) {
                  <tr>
                    <td class="text-muted">{{ idx + 1 }}</td>
                    <td class="font-semibold title-col">{{ policy.title }}</td>
                    <td>{{ policy.ministry }}</td>
                    <td class="text-muted">{{ policy.state }}</td>
                    <td>{{ policy.category }}</td>
                    <td>
                      <span class="status-chip" [ngClass]="getStatusChipClass(policy.status)">
                        {{ policy.status }}
                      </span>
                    </td>
                    <td class="text-muted">{{ policy.date }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './policy-analytics.component.scss'
})
export class PolicyAnalyticsComponent implements OnInit {
  private mockService = inject(MockAnalyticsService);

  activeFilters = signal<Record<string, string>>({});

  stats = signal<AnalyticsStat[]>([]);
  categoryLabels = signal<string[]>([]);
  categoryData = signal<number[]>([]);
  trendLabels = signal<string[]>([]);
  trendDatasets = signal<LineDataset[]>([]);
  stateLabels = signal<string[]>([]);
  stateData = signal<number[]>([]);
  ministryLabels = signal<string[]>([]);
  ministryData = signal<number[]>([]);
  latestPolicies = signal<PolicyRow[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const filters = this.activeFilters();

    // Stats
    this.mockService.getPolicyAnalyticsStats(filters).subscribe(res => this.stats.set(res));

    // Category Doughnut
    this.mockService.getPoliciesByCategory(filters).subscribe(res => {
      this.categoryLabels.set(res.map(c => `${c.label} (${c.percentage}%)`));
      this.categoryData.set(res.map(c => c.percentage));
    });

    // Trend Line
    this.mockService.getPolicyStatusTrend(filters).subscribe(res => {
      this.trendLabels.set(res.labels);
      this.trendDatasets.set(
        res.series.map(s => ({
          label: s.label,
          data: s.data,
          borderColor: s.color,
          backgroundColor: 'transparent'
        }))
      );
    });

    // Policies by State HBar
    this.mockService.getPoliciesByState(filters).subscribe(res => {
      this.stateLabels.set(res.map(r => r.label));
      this.stateData.set(res.map(r => r.value));
    });

    // Policies by Ministry VBar
    this.mockService.getPoliciesByMinistry(filters).subscribe(res => {
      this.ministryLabels.set(res.map(r => r.label));
      this.ministryData.set(res.map(r => r.value));
    });

    // Latest Policies
    this.mockService.getLatestPolicies(filters).subscribe(res => this.latestPolicies.set(res));
  }

  onApplyFilters(filters: Record<string, string>): void {
    this.activeFilters.set(filters);
    this.loadData();
  }

  onResetFilters(): void {
    this.activeFilters.set({});
    this.loadData();
  }

  exportReport(): void {
    this.mockService.downloadReport('pdf').subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'policy-analytics-report.pdf';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => alert('Could not export report. Please try again.')
    });
  }

  getStatIcon(index: number): string {
    const icons = ['description', 'check_circle', 'schedule', 'close', 'archive'];
    return icons[index % icons.length];
  }

  getStatIconClass(index: number): string {
    const classes = ['blue', 'green', 'orange', 'red', 'purple'];
    return classes[index % classes.length];
  }

  getStatusChipClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'chip-green';
      case 'pending': return 'chip-orange';
      case 'rejected': return 'chip-red';
      default: return 'chip-gray';
    }
  }
}
