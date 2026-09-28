import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [NgClass],
  template: `
    <div class="date-picker-wrapper">
      <button type="button" class="date-picker-btn" (click)="toggleDropdown()">
        <span class="material-icons calendar-icon">calendar_today</span>
        <span class="selected-text">{{ selectedRange() }}</span>
        <span class="material-icons chevron-icon">expand_more</span>
      </button>

      @if (isOpen()) {
        <div class="dropdown-menu">
          @for (preset of presets; track preset) {
            <button
              type="button"
              class="dropdown-item"
              [ngClass]="{ 'active': preset === selectedRange() }"
              (click)="selectPreset(preset)"
            >
              {{ preset }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .date-picker-wrapper {
      position: relative;
      display: inline-block;
    }
    .date-picker-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #ffffff;
      border: 1px solid var(--border, #e3e8f0);
      border-radius: 8px;
      padding: 0.5rem 0.875rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--ink, #0f1b3d);
      cursor: pointer;
      transition: all 0.15s ease;
      &:hover { border-color: var(--blue, #2f6fed); }
      .calendar-icon, .chevron-icon { font-size: 1.125rem; color: var(--muted, #6b7688); }
    }
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      background: #ffffff;
      border: 1px solid var(--border, #e3e8f0);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(15, 27, 61, 0.1);
      z-index: 100;
      min-width: 200px;
      padding: 0.25rem 0;
    }
    .dropdown-item {
      display: block;
      width: 100%;
      text-align: left;
      padding: 0.5rem 1rem;
      border: none;
      background: none;
      font-size: 0.875rem;
      color: var(--ink, #0f1b3d);
      cursor: pointer;
      transition: background 0.15s ease;
      &:hover { background: #f1f5f9; }
      &.active { font-weight: 600; color: var(--blue, #2f6fed); background: #e8f0fe; }
    }
  `]
})
export class DateRangePickerComponent {
  selectedRange = signal<string>('Jan 1, 2024 - Sep 30, 2024');
  isOpen = signal<boolean>(false);

  presets = [
    'Today',
    'Last 7 Days',
    'Sep 1, 2024 - Sep 30, 2024',
    'Jan 1, 2024 - Sep 30, 2024',
    'Last 12 Months',
    'Year to Date'
  ];

  toggleDropdown() {
    this.isOpen.update(v => !v);
  }

  selectPreset(preset: string) {
    this.selectedRange.set(preset);
    this.isOpen.set(false);
  }
}
