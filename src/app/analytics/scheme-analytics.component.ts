import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass, DecimalPipe } from '@angular/common';
import { MockAnalyticsService } from './analytics.mock.service';
import {
  AnalyticsStat,
  CategorySlice,
  TrendData,
  BarChartData,
  SchemeRow,
  SchemeUpdateRow
} from './analytics.models';
import { DateRangePickerComponent } from '../shared/components/date-range-picker/date-range-picker.component';
import { FiltersBarComponent } from './shared/filters-bar.component';
import { HbarChartComponent } from '../shared/components/hbar-chart/hbar-chart.component';
import { LineChartComponent, LineDataset } from '../shared/components/line-chart/line-chart.component';
import { DoughnutChartComponent } from '../shared/components/doughnut-chart/doughnut-chart.component';

@Component({
  selector: 'app-scheme-analytics',
  standalone: true,
  imports: [
    NgClass,
    DecimalPipe,
    DateRangePickerComponent,
    FiltersBarComponent,
    HbarChartComponent,
    LineChartComponent,
    DoughnutChartComponent
  ],
  template: `
    <div class="scheme-analytics-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span>Home</span>
        <span class="chevron">&gt;</span>
        <span>Analytics</span>
        <span class="chevron">&gt;</span>
        <span class="current">Scheme Analytics</span>
      </div>

      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Scheme Analytics</h1>
          <p class="page-subtitle">Insights into government schemes and their reach</p>
        </div>
        <div class="header-right">
          <button type="button" class="btn-download" (click)="downloadReport()">
            <span class="material-icons">download</span>
            Download Report
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
        <!-- Card 1: Schemes by Category -->
        <div class="chart-card">
          <h3 class="card-title">Schemes by Category</h3>
          <app-doughnut-chart
            [labels]="categoryLabels()"
            [data]="categoryData()"
            [colors]="['#3cb371', '#2f6fed', '#06b6d4', '#f5a524', '#8b5cf6', '#e5484d', '#14b8a6', '#f43f5e', '#94a3b8']"
            centerMainText="438"
            centerSubText="Schemes"
          />
        </div>

        <!-- Card 2: Scheme Trend -->
        <div class="chart-card flex-grow-1">
          <div class="card-header-row">
            <h3 class="card-title">Scheme Trend</h3>
            <div class="badge-filter">
              <span>Last 12 Months</span>
              <span class="material-icons">expand_more</span>
            </div>
          </div>
          <app-line-chart
            [labels]="trendLabels()"
            [datasets]="trendDatasets()"
            [yMin]="0"
            [yMax]="100"
          />
        </div>

        <!-- Card 3: Schemes by State -->
        <div class="chart-card">
          <div class="card-header-row">
            <h3 class="card-title">Schemes by State</h3>
            <div class="badge-filter">
              <span>Top 10 States</span>
            </div>
          </div>
          <app-hbar-chart
            [labels]="stateLabels()"
            [data]="stateData()"
            selectedDepartment="All Departments"
            primaryColor="#3cb371"
          />
        </div>
      </div>

      <!-- Row of 2 Cards: Top 5 Viewed Schemes + Recent Scheme Updates -->
      <div class="charts-two-row">
        <!-- Top 5 Most Viewed Schemes Table -->
        <div class="table-card flex-1">
          <div class="table-header-row">
            <h3 class="card-title">Top 5 Most Viewed Schemes</h3>
            <a href="javascript:void(0)" class="link-view-all">View All</a>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Scheme Name</th>
                  <th>Ministry</th>
                  <th>Views</th>
                  <th>Applications</th>
                </tr>
              </thead>
              <tbody>
                @for (scheme of topViewedSchemes(); track scheme.name) {
                  <tr>
                    <td class="text-muted">{{ scheme.rank }}</td>
                    <td class="font-semibold name-col">{{ scheme.name }}</td>
                    <td class="text-muted">{{ scheme.ministry }}</td>
                    <td>
                      <span class="badge-views">{{ scheme.views | number }}</span>
                    </td>
                    <td class="font-medium">{{ scheme.applications | number }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Scheme Updates Table -->
        <div class="table-card flex-1">
          <div class="table-header-row">
            <h3 class="card-title">Recent Scheme Updates</h3>
            <a href="javascript:void(0)" class="link-view-all">View All</a>
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Ministry</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (item of recentUpdates(); track item.title) {
                  <tr>
                    <td class="font-semibold title-col">{{ item.title }}</td>
                    <td class="text-muted">{{ item.ministry }}</td>
                    <td>
                      <span class="type-chip" [ngClass]="getTypeChipClass(item.type)">
                        {{ item.type }}
                      </span>
                    </td>
                    <td class="text-muted">{{ item.date }}</td>
                    <td>
                      <span class="status-chip chip-green">{{ item.status }}</span>
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
  styleUrl: './scheme-analytics.component.scss'
})
export class SchemeAnalyticsComponent implements OnInit {
  private mockService = inject(MockAnalyticsService);

  activeFilters = signal<Record<string, string>>({});

  stats = signal<AnalyticsStat[]>([]);
  categoryLabels = signal<string[]>([]);
  categoryData = signal<number[]>([]);
  trendLabels = signal<string[]>([]);
  trendDatasets = signal<LineDataset[]>([]);
  stateLabels = signal<string[]>([]);
  stateData = signal<number[]>([]);
  topViewedSchemes = signal<SchemeRow[]>([]);
  recentUpdates = signal<SchemeUpdateRow[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const filters = this.activeFilters();

    // Stats
    this.mockService.getSchemeAnalyticsStats(filters).subscribe(res => this.stats.set(res));

    // Category Doughnut
    this.mockService.getSchemesByCategoryDetailed(filters).subscribe(res => {
      this.categoryLabels.set(res.map(c => `${c.label} (${c.percentage}%)`));
      this.categoryData.set(res.map(c => c.percentage));
    });

    // Trend Line
    this.mockService.getSchemeTrend(filters).subscribe(res => {
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

    // Schemes by State HBar
    this.mockService.getSchemesByState(filters).subscribe(res => {
      this.stateLabels.set(res.map(r => r.label));
      this.stateData.set(res.map(r => r.value));
    });

    // Top Viewed Schemes Table
    this.mockService.getTopViewedSchemes(filters).subscribe(res => this.topViewedSchemes.set(res));

    // Recent Scheme Updates Table
    this.mockService.getRecentSchemeUpdates(filters).subscribe(res => this.recentUpdates.set(res));
  }

  onApplyFilters(filters: Record<string, string>): void {
    this.activeFilters.set(filters);
    this.loadData();
  }

  onResetFilters(): void {
    this.activeFilters.set({});
    this.loadData();
  }

  downloadReport(): void {
    this.mockService.downloadReport('pdf').subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'scheme-analytics-report.pdf';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => alert('Could not download report. Please try again.')
    });
  }

  getStatIcon(index: number): string {
    const icons = ['folder', 'check_circle', 'schedule', 'close', 'archive'];
    return icons[index % icons.length];
  }

  getStatIconClass(index: number): string {
    const classes = ['green', 'blue', 'orange', 'red', 'purple'];
    return classes[index % classes.length];
  }

  getTypeChipClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'update': return 'type-blue';
      case 'notification': return 'type-purple';
      case 'new scheme': return 'type-green';
      default: return 'type-gray';
    }
  }
}
