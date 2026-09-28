import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { MockAnalyticsService } from './analytics.mock.service';
import { DateRangePickerComponent } from '../shared/components/date-range-picker/date-range-picker.component';
import { HbarChartComponent } from '../shared/components/hbar-chart/hbar-chart.component';
import { LineChartComponent, LineDataset } from '../shared/components/line-chart/line-chart.component';
import { DoughnutChartComponent } from '../shared/components/doughnut-chart/doughnut-chart.component';

export interface DepartmentItem {
  id: string;
  name: string;
  count: number;
  icon: string;
  iconBg: string;
  iconColor: string;
  overview: {
    title: string;
    totalPolicies: number;
    activePolicies: number;
    pendingPolicies: number;
    rejectedPolicies: number;
    totalSchemes: number;
    activeSchemes: number;
    pendingSchemes: number;
    rejectedSchemes: number;
  };
}

@Component({
  selector: 'app-department-analytics',
  standalone: true,
  imports: [
    NgClass,
    DateRangePickerComponent,
    HbarChartComponent,
    LineChartComponent,
    DoughnutChartComponent
  ],
  template: `
    <div class="department-analytics-page">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <span>Home</span>
        <span class="chevron">&gt;</span>
        <span>Analytics</span>
        <span class="chevron">&gt;</span>
        <span class="current">Department Analytics</span>
      </div>

      <!-- Header Row -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">Department Analytics</h1>
          <p class="page-subtitle">Department-wise analysis of policies, schemes and platform activity</p>
        </div>
        <div class="header-right">
          <app-date-range-picker />
          <button type="button" class="btn-download" (click)="download()">
            <span class="material-icons">download</span>
            Download Report
          </button>
        </div>
      </div>

      <!-- Top Metric Cards Grid (6 cards) -->
      <div class="top-cards-grid">
        <div class="metric-card">
          <div class="card-icon-wrapper blue">
            <span class="material-icons">account_balance</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Departments</span>
            <div class="card-value-row">
              <span class="card-value">56</span>
              <span class="card-badge green">↑ 12%</span>
            </div>
            <span class="card-subtext">from last period</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="card-icon-wrapper blue-light">
            <span class="material-icons">description</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Policies</span>
            <div class="card-value-row">
              <span class="card-value">1,250</span>
              <span class="card-badge green">↑ 18%</span>
            </div>
            <span class="card-subtext">from last period</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="card-icon-wrapper green">
            <span class="material-icons">folder</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Schemes</span>
            <div class="card-value-row">
              <span class="card-value">438</span>
              <span class="card-badge green">↑ 20%</span>
            </div>
            <span class="card-subtext">from last period</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="card-icon-wrapper purple">
            <span class="material-icons">people</span>
          </div>
          <div class="card-content">
            <span class="card-label">Active Departments</span>
            <div class="card-value-row">
              <span class="card-value">48</span>
              <span class="card-badge green">↑ 9%</span>
            </div>
            <span class="card-subtext">from last period</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="card-icon-wrapper cyan">
            <span class="material-icons">visibility</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Views</span>
            <div class="card-value-row">
              <span class="card-value">185,420</span>
              <span class="card-badge green">↑ 25%</span>
            </div>
            <span class="card-subtext">from last period</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="card-icon-wrapper blue-gradient">
            <span class="material-icons">file_download</span>
          </div>
          <div class="card-content">
            <span class="card-label">Total Downloads</span>
            <div class="card-value-row">
              <span class="card-value">28,760</span>
              <span class="card-badge green">↑ 22%</span>
            </div>
            <span class="card-subtext">from last period</span>
          </div>
        </div>
      </div>

      <!-- Main Layout 2 Columns -->
      <div class="dashboard-body">
        <!-- Left Sidebar: Departments List -->
        <div class="departments-sidebar">
          <h3 class="sidebar-title">Departments</h3>
          <div class="search-input-wrapper">
            <span class="material-icons search-icon">search</span>
            <input
              type="text"
              placeholder="Search departments..."
              class="dept-search-input"
              [value]="searchQuery()"
              (input)="updateSearch($event)"
            />
          </div>

          <div class="departments-list">
            @for (dept of filteredDepartments(); track dept.id) {
              <div
                class="dept-item"
                [ngClass]="{ 'active': selectedDept().id === dept.id }"
                (click)="selectDepartment(dept)"
              >
                <div class="dept-icon-circle" [style.background-color]="dept.iconBg" [style.color]="dept.iconColor">
                  <span class="material-icons">{{ dept.icon }}</span>
                </div>
                <div class="dept-info">
                  <span class="dept-name">{{ dept.name }}</span>
                  <span class="dept-count">{{ dept.count }} {{ dept.id === 'all' ? 'departments' : 'departments' }}</span>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Right Main Panel -->
        <div class="main-panel">
          <!-- Top Row: Department Overview & Line Chart -->
          <div class="panel-top-row">
            <!-- Department Overview Card -->
            <div class="dept-overview-card">
              <div class="overview-header">
                <div class="header-title-box">
                  <div class="dept-avatar">
                    <span class="material-icons">account_balance</span>
                  </div>
                  <div>
                    <h3 class="overview-dept-name">{{ currentOverview().title }}</h3>
                    <p class="overview-subtitle">Policies, schemes and activity overview</p>
                  </div>
                </div>
                <button type="button" class="btn-view-details">
                  View Details
                  <span class="material-icons">open_in_new</span>
                </button>
              </div>

              <div class="stats-grid">
                <!-- Row 1: Policies -->
                <div class="stat-cell">
                  <div class="cell-icon blue"><span class="material-icons">description</span></div>
                  <div>
                    <span class="cell-label">Total Policies</span>
                    <span class="cell-value">{{ currentOverview().totalPolicies }}</span>
                  </div>
                </div>

                <div class="stat-cell">
                  <div class="cell-icon green"><span class="material-icons">check_circle</span></div>
                  <div>
                    <span class="cell-label">Active Policies</span>
                    <span class="cell-value">{{ currentOverview().activePolicies }}</span>
                  </div>
                </div>

                <div class="stat-cell">
                  <div class="cell-icon orange"><span class="material-icons">hourglass_empty</span></div>
                  <div>
                    <span class="cell-label">Pending</span>
                    <span class="cell-value">{{ currentOverview().pendingPolicies }}</span>
                  </div>
                </div>

                <div class="stat-cell">
                  <div class="cell-icon red"><span class="material-icons">close</span></div>
                  <div>
                    <span class="cell-label">Rejected</span>
                    <span class="cell-value">{{ currentOverview().rejectedPolicies }}</span>
                  </div>
                </div>

                <!-- Row 2: Schemes -->
                <div class="stat-cell">
                  <div class="cell-icon green"><span class="material-icons">folder</span></div>
                  <div>
                    <span class="cell-label">Total Schemes</span>
                    <span class="cell-value">{{ currentOverview().totalSchemes }}</span>
                  </div>
                </div>

                <div class="stat-cell">
                  <div class="cell-icon green"><span class="material-icons">check_circle</span></div>
                  <div>
                    <span class="cell-label">Active Schemes</span>
                    <span class="cell-value">{{ currentOverview().activeSchemes }}</span>
                  </div>
                </div>

                <div class="stat-cell">
                  <div class="cell-icon orange"><span class="material-icons">hourglass_empty</span></div>
                  <div>
                    <span class="cell-label">Pending</span>
                    <span class="cell-value">{{ currentOverview().pendingSchemes }}</span>
                  </div>
                </div>

                <div class="stat-cell">
                  <div class="cell-icon red"><span class="material-icons">close</span></div>
                  <div>
                    <span class="cell-label">Rejected</span>
                    <span class="cell-value">{{ currentOverview().rejectedSchemes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Policies vs Schemes Trend Line Chart -->
            <div class="chart-card trend-card">
              <div class="card-header-row">
                <h3 class="card-title">Policies vs Schemes Trend</h3>
                <div class="time-filter">
                  <span>Last 12 Months</span>
                  <span class="material-icons">expand_more</span>
                </div>
              </div>
              <app-line-chart
                [labels]="monthLabels"
                [datasets]="trendDatasets"
                [yMin]="0"
                [yMax]="50"
              />
            </div>
          </div>

          <!-- Middle Row: 3 Visualizations -->
          <div class="panel-middle-row">
            <div class="chart-card">
              <h3 class="card-title">Policy Distribution by Department</h3>
              <app-hbar-chart
                [labels]="policyDeptLabels"
                [data]="policyDeptData"
                [selectedDepartment]="selectedDept().name"
                primaryColor="#2f6fed"
                dimmedColor="rgba(47, 111, 237, 0.25)"
              />
            </div>

            <div class="chart-card">
              <h3 class="card-title">Scheme Distribution by Department</h3>
              <app-hbar-chart
                [labels]="schemeDeptLabels"
                [data]="schemeDeptData"
                [selectedDepartment]="selectedDept().name"
                primaryColor="#3cb371"
                dimmedColor="rgba(60, 179, 113, 0.25)"
              />
            </div>

            <div class="chart-card">
              <h3 class="card-title">Department-wise User Engagement</h3>
              <app-doughnut-chart
                [labels]="engagementLabels"
                [data]="engagementData"
                [colors]="['#2f6fed', '#3cb371', '#8b5cf6', '#f5a524', '#e5484d', '#06b6d4', '#94a3b8']"
                centerMainText="185,420"
                centerSubText="Total Views"
              />
            </div>
          </div>

          <!-- Bottom Row: Department Performance Table -->
          <div class="table-card">
            <div class="table-header-row">
              <h3 class="card-title">Department Performance</h3>
              <a href="javascript:void(0)" class="link-view-all">View All</a>
            </div>

            <div class="table-responsive">
              <table class="perf-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Department</th>
                    <th>Total Policies</th>
                    <th>Active Policies</th>
                    <th>Total Schemes</th>
                    <th>Active Schemes</th>
                    <th>Total Views</th>
                    <th>Downloads</th>
                    <th>Last Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of tableRows; track row.rank) {
                    <tr>
                      <td class="text-muted">{{ row.rank }}</td>
                      <td class="font-semibold">{{ row.name }}</td>
                      <td>{{ row.totalPolicies }}</td>
                      <td>{{ row.activePolicies }}</td>
                      <td>{{ row.totalSchemes }}</td>
                      <td>{{ row.activeSchemes }}</td>
                      <td>{{ row.totalViews }}</td>
                      <td>{{ row.downloads }}</td>
                      <td class="text-muted">{{ row.lastUpdated }}</td>
                      <td>
                        <button type="button" class="btn-table-action">View</button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './department-analytics.component.scss'
})
export class DepartmentAnalyticsComponent implements OnInit {
  private api = inject(MockAnalyticsService);

  searchQuery = signal<string>('');
  selectedDept = signal<DepartmentItem>({
    id: 'all',
    name: 'All Departments',
    count: 56,
    icon: 'account_balance',
    iconBg: '#e8f0fe',
    iconColor: '#2f6fed',
    overview: {
      title: 'Ministry of Agriculture & Farmers Welfare',
      totalPolicies: 120,
      activePolicies: 108,
      pendingPolicies: 8,
      rejectedPolicies: 4,
      totalSchemes: 45,
      activeSchemes: 38,
      pendingSchemes: 5,
      rejectedSchemes: 2
    }
  });

  departmentsList: DepartmentItem[] = [
    {
      id: 'all',
      name: 'All Departments',
      count: 56,
      icon: 'account_balance',
      iconBg: '#e8f0fe',
      iconColor: '#2f6fed',
      overview: {
        title: 'Ministry of Agriculture & Farmers Welfare',
        totalPolicies: 120,
        activePolicies: 108,
        pendingPolicies: 8,
        rejectedPolicies: 4,
        totalSchemes: 45,
        activeSchemes: 38,
        pendingSchemes: 5,
        rejectedSchemes: 2
      }
    },
    {
      id: 'agriculture',
      name: 'Agriculture',
      count: 6,
      icon: 'eco',
      iconBg: '#e6f4ea',
      iconColor: '#3cb371',
      overview: {
        title: 'Ministry of Agriculture & Farmers Welfare',
        totalPolicies: 120,
        activePolicies: 108,
        pendingPolicies: 8,
        rejectedPolicies: 4,
        totalSchemes: 45,
        activeSchemes: 38,
        pendingSchemes: 5,
        rejectedSchemes: 2
      }
    },
    {
      id: 'education',
      name: 'Education',
      count: 5,
      icon: 'school',
      iconBg: '#e8f0fe',
      iconColor: '#2f6fed',
      overview: {
        title: 'Ministry of Education & Literacy',
        totalPolicies: 95,
        activePolicies: 82,
        pendingPolicies: 9,
        rejectedPolicies: 4,
        totalSchemes: 32,
        activeSchemes: 28,
        pendingSchemes: 3,
        rejectedSchemes: 1
      }
    },
    {
      id: 'health',
      name: 'Health & Family Welfare',
      count: 4,
      icon: 'favorite',
      iconBg: '#ffe4e6',
      iconColor: '#e5484d',
      overview: {
        title: 'Department of Health & Family Welfare',
        totalPolicies: 88,
        activePolicies: 76,
        pendingPolicies: 8,
        rejectedPolicies: 4,
        totalSchemes: 28,
        activeSchemes: 24,
        pendingSchemes: 3,
        rejectedSchemes: 1
      }
    },
    {
      id: 'rural',
      name: 'Rural Development',
      count: 5,
      icon: 'park',
      iconBg: '#e6f4ea',
      iconColor: '#3cb371',
      overview: {
        title: 'Department of Rural Development',
        totalPolicies: 76,
        activePolicies: 68,
        pendingPolicies: 5,
        rejectedPolicies: 3,
        totalSchemes: 38,
        activeSchemes: 32,
        pendingSchemes: 4,
        rejectedSchemes: 2
      }
    },
    {
      id: 'urban',
      name: 'Urban Development',
      count: 4,
      icon: 'apartment',
      iconBg: '#fef3c7',
      iconColor: '#f5a524',
      overview: {
        title: 'Ministry of Housing & Urban Affairs',
        totalPolicies: 64,
        activePolicies: 58,
        pendingPolicies: 4,
        rejectedPolicies: 2,
        totalSchemes: 24,
        activeSchemes: 20,
        pendingSchemes: 3,
        rejectedSchemes: 1
      }
    },
    {
      id: 'finance',
      name: 'Finance',
      count: 3,
      icon: 'account_balance_wallet',
      iconBg: '#fef3c7',
      iconColor: '#d97706',
      overview: {
        title: 'Ministry of Finance',
        totalPolicies: 52,
        activePolicies: 46,
        pendingPolicies: 4,
        rejectedPolicies: 2,
        totalSchemes: 18,
        activeSchemes: 16,
        pendingSchemes: 1,
        rejectedSchemes: 1
      }
    },
    {
      id: 'home',
      name: 'Home Affairs',
      count: 4,
      icon: 'security',
      iconBg: '#f3e8ff',
      iconColor: '#8b5cf6',
      overview: {
        title: 'Ministry of Home Affairs',
        totalPolicies: 45,
        activePolicies: 40,
        pendingPolicies: 3,
        rejectedPolicies: 2,
        totalSchemes: 15,
        activeSchemes: 13,
        pendingSchemes: 1,
        rejectedSchemes: 1
      }
    },
    {
      id: 'labour',
      name: 'Labour & Employment',
      count: 4,
      icon: 'work',
      iconBg: '#ffe4e6',
      iconColor: '#e5484d',
      overview: {
        title: 'Ministry of Labour & Employment',
        totalPolicies: 48,
        activePolicies: 42,
        pendingPolicies: 4,
        rejectedPolicies: 2,
        totalSchemes: 20,
        activeSchemes: 18,
        pendingSchemes: 1,
        rejectedSchemes: 1
      }
    },
    {
      id: 'social',
      name: 'Social Justice',
      count: 3,
      icon: 'groups',
      iconBg: '#f3e8ff',
      iconColor: '#8b5cf6',
      overview: {
        title: 'Ministry of Social Justice & Empowerment',
        totalPolicies: 38,
        activePolicies: 32,
        pendingPolicies: 4,
        rejectedPolicies: 2,
        totalSchemes: 18,
        activeSchemes: 15,
        pendingSchemes: 2,
        rejectedSchemes: 1
      }
    },
    {
      id: 'environment',
      name: 'Environment & Forests',
      count: 3,
      icon: 'forest',
      iconBg: '#e6f4ea',
      iconColor: '#3cb371',
      overview: {
        title: 'Ministry of Environment, Forest & Climate Change',
        totalPolicies: 32,
        activePolicies: 28,
        pendingPolicies: 3,
        rejectedPolicies: 1,
        totalSchemes: 16,
        activeSchemes: 14,
        pendingSchemes: 1,
        rejectedSchemes: 1
      }
    },
    {
      id: 'skill',
      name: 'Skill Development',
      count: 2,
      icon: 'build',
      iconBg: '#e8f0fe',
      iconColor: '#2f6fed',
      overview: {
        title: 'Ministry of Skill Development & Entrepreneurship',
        totalPolicies: 28,
        activePolicies: 24,
        pendingPolicies: 3,
        rejectedPolicies: 1,
        totalSchemes: 14,
        activeSchemes: 12,
        pendingSchemes: 1,
        rejectedSchemes: 1
      }
    },
    {
      id: 'women',
      name: 'Women & Child Development',
      count: 3,
      icon: 'child_care',
      iconBg: '#f3e8ff',
      iconColor: '#8b5cf6',
      overview: {
        title: 'Ministry of Women & Child Development',
        totalPolicies: 25,
        activePolicies: 21,
        pendingPolicies: 3,
        rejectedPolicies: 1,
        totalSchemes: 12,
        activeSchemes: 10,
        pendingSchemes: 1,
        rejectedSchemes: 1
      }
    }
  ];

  filteredDepartments = signal<DepartmentItem[]>(this.departmentsList);
  currentOverview = signal(this.departmentsList[0].overview);

  // Line Chart Data
  monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  trendDatasets: LineDataset[] = [
    {
      label: 'Policies',
      data: [15, 20, 25, 24, 30, 28, 35, 38, 38, 42, 45, 48],
      borderColor: '#2f6fed',
      backgroundColor: 'transparent'
    },
    {
      label: 'Schemes',
      data: [10, 12, 16, 18, 20, 24, 25, 26, 25, 28, 30, 32],
      borderColor: '#3cb371',
      backgroundColor: 'transparent'
    }
  ];

  // HBar Charts Data
  policyDeptLabels = [
    'Agriculture',
    'Education',
    'Health & Family Welfare',
    'Rural Development',
    'Urban Development',
    'Finance',
    'Labour & Employment',
    'Home Affairs',
    'Social Justice',
    'Environment & Forests'
  ];
  policyDeptData = [120, 95, 88, 76, 64, 52, 48, 45, 38, 32];

  schemeDeptLabels = [
    'Agriculture',
    'Rural Development',
    'Education',
    'Health & Family Welfare',
    'Urban Development',
    'Labour & Employment',
    'Social Justice',
    'Environment & Forests',
    'Skill Development',
    'Women & Child Development'
  ];
  schemeDeptData = [45, 38, 32, 28, 24, 20, 18, 16, 14, 12];

  // Doughnut Data
  engagementLabels = [
    'Agriculture (24%)',
    'Education (18%)',
    'Health & Family Welfare (15%)',
    'Rural Development (12%)',
    'Urban Development (9%)',
    'Finance (7%)',
    'Others (15%)'
  ];
  engagementData = [24, 18, 15, 12, 9, 7, 15];

  // Table Data
  tableRows = [
    { rank: 1, name: 'Agriculture & Farmers Welfare', totalPolicies: 120, activePolicies: 108, totalSchemes: 45, activeSchemes: 38, totalViews: '45,230', downloads: '7,890', lastUpdated: 'Sep 30, 2024' },
    { rank: 2, name: 'Education', totalPolicies: 95, activePolicies: 82, totalSchemes: 32, activeSchemes: 28, totalViews: '32,450', downloads: '5,620', lastUpdated: 'Sep 29, 2024' },
    { rank: 3, name: 'Health & Family Welfare', totalPolicies: 88, activePolicies: 76, totalSchemes: 28, activeSchemes: 24, totalViews: '28,760', downloads: '4,980', lastUpdated: 'Sep 29, 2024' },
    { rank: 4, name: 'Rural Development', totalPolicies: 76, activePolicies: 68, totalSchemes: 38, activeSchemes: 32, totalViews: '26,540', downloads: '4,120', lastUpdated: 'Sep 28, 2024' },
    { rank: 5, name: 'Urban Development', totalPolicies: 64, activePolicies: 58, totalSchemes: 24, activeSchemes: 20, totalViews: '22,180', downloads: '3,860', lastUpdated: 'Sep 28, 2024' }
  ];

  ngOnInit(): void {
    // Initial fetch from mock service
    this.api.getDepartmentAnalytics().subscribe();
  }

  updateSearch(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchQuery.set(query);
    this.filteredDepartments.set(
      this.departmentsList.filter(d => d.name.toLowerCase().includes(query))
    );
  }

  selectDepartment(dept: DepartmentItem): void {
    this.selectedDept.set(dept);
    this.currentOverview.set(dept.overview);
  }

  download() {
    this.api.downloadReport('pdf').subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'department-analytics-report.pdf';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => alert('Could not download the report. Please try again.')
    });
  }
}
