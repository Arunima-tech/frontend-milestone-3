import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass],
  template: `
    <div class="app-container" [ngClass]="{ 'sidebar-collapsed': !sidebarOpen() }">
      <!-- Mobile Backdrop -->
      @if (sidebarOpen()) {
        <div class="sidebar-backdrop" (click)="toggleSidebar()"></div>
      }

      <!-- Sidebar -->
      <aside class="sidebar" [ngClass]="{ 'open': sidebarOpen() }">
        <div class="sidebar-header">
          <div class="brand">
            <span class="logo-icon material-icons">account_balance</span>
            <div class="brand-text">
              <h1 class="logo-title">PolicySetu</h1>
              <p class="logo-tagline">Connecting Citizens to Government</p>
            </div>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">dashboard</span>
            <span class="nav-label">Dashboard</span>
          </a>

          <!-- Analytics Group -->
          <div class="nav-group" [ngClass]="{ 'expanded': analyticsExpanded() }">
            <button type="button" class="nav-item group-header active" (click)="toggleAnalytics()">
              <span class="material-icons nav-icon">analytics</span>
              <span class="nav-label">Analytics</span>
              <span class="material-icons expand-icon">
                {{ analyticsExpanded() ? 'expand_less' : 'expand_more' }}
              </span>
            </button>

            @if (analyticsExpanded()) {
              <div class="sub-nav">
                <a routerLink="/analytics/overview" routerLinkActive="active" class="sub-nav-item">
                  <span class="sub-bullet"></span>
                  <span class="nav-label">Overview</span>
                </a>
                <a routerLink="/analytics/policies" routerLinkActive="active" class="sub-nav-item">
                  <span class="sub-bullet"></span>
                  <span class="nav-label">Policy Analytics</span>
                </a>
                <a routerLink="/analytics/schemes" routerLinkActive="active" class="sub-nav-item">
                  <span class="sub-bullet"></span>
                  <span class="nav-label">Scheme Analytics</span>
                </a>
                <a routerLink="/analytics/users" routerLinkActive="active" class="sub-nav-item">
                  <span class="sub-bullet"></span>
                  <span class="nav-label">User Analytics</span>
                </a>
                <a routerLink="/analytics/departments" routerLinkActive="active" class="sub-nav-item">
                  <span class="sub-bullet"></span>
                  <span class="nav-label">Department Analytics</span>
                </a>
                <a routerLink="/analytics/usage" routerLinkActive="active" class="sub-nav-item">
                  <span class="sub-bullet"></span>
                  <span class="nav-label">Usage Statistics</span>
                </a>
              </div>
            }
          </div>

          <a routerLink="/policies" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">description</span>
            <span class="nav-label">Policies</span>
          </a>

          <a routerLink="/schemes" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">folder_shared</span>
            <span class="nav-label">Schemes</span>
          </a>

          <a routerLink="/users" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">people</span>
            <span class="nav-label">Users</span>
          </a>

          <a routerLink="/reports" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">assessment</span>
            <span class="nav-label">Reports</span>
          </a>

          <a routerLink="/notifications" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">notifications</span>
            <span class="nav-label">Notifications</span>
            <span class="badge">3</span>
          </a>

          <a routerLink="/feedback" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">rate_review</span>
            <span class="nav-label">Feedback</span>
          </a>

          <a routerLink="/audit-logs" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">history</span>
            <span class="nav-label">Audit Logs</span>
          </a>

          <a routerLink="/settings" routerLinkActive="active" class="nav-item">
            <span class="material-icons nav-icon">settings</span>
            <span class="nav-label">Settings</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="footer-card">
            <span class="material-icons footer-icon">account_balance</span>
            <p class="footer-text">Building a Transparent Government for a Better Tomorrow</p>
          </div>
        </div>
      </aside>

      <!-- Main Layout Right Side -->
      <div class="main-wrapper">
        <!-- Top Bar -->
        <header class="topbar">
          <div class="topbar-left">
            <button type="button" class="icon-btn toggle-btn" (click)="toggleSidebar()" aria-label="Toggle Sidebar">
              <span class="material-icons">menu</span>
            </button>

            <div class="search-box">
              <span class="material-icons search-icon">search</span>
              <input
                type="text"
                placeholder="Search policies, schemes, users, departments..."
                class="search-input"
              />
            </div>
          </div>

          <div class="topbar-right">
            <div class="notification-wrapper">
              <button type="button" class="icon-btn bell-btn" aria-label="Notifications">
                <span class="material-icons">notifications</span>
                <span class="bell-badge">3</span>
              </button>
            </div>

            <div class="user-profile">
              <div class="avatar">A</div>
              <div class="user-info">
                <span class="user-name">Admin User</span>
                <span class="user-role">Administrator</span>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Body -->
        <main class="content-area">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  sidebarOpen = signal<boolean>(true);
  analyticsExpanded = signal<boolean>(true);

  toggleSidebar(): void {
    this.sidebarOpen.update(val => !val);
  }

  toggleAnalytics(): void {
    this.analyticsExpanded.update(val => !val);
  }
}
