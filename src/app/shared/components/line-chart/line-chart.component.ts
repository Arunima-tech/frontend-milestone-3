import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  afterNextRender
} from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export interface LineDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor?: string;
  fill?: boolean;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `
    <div class="chart-container" style="position: relative; height: 260px; width: 100%;">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 260px;
    }
  `]
})
export class LineChartComponent implements OnChanges, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() datasets: LineDataset[] = [];
  @Input() yMin: number = 0;
  @Input() yMax: number = 50;

  private chartInstance: Chart | null = null;
  private isInitialized = false;

  constructor() {
    afterNextRender(() => {
      this.isInitialized = true;
      this.createOrUpdateChart();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isInitialized) {
      this.createOrUpdateChart();
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  private createOrUpdateChart(): void {
    if (!this.chartCanvas || !this.chartCanvas.nativeElement) return;

    if (this.chartInstance) {
      this.chartInstance.data.labels = this.labels;
      this.chartInstance.data.datasets = this.datasets.map(ds => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.borderColor,
        backgroundColor: ds.backgroundColor || 'transparent',
        tension: 0.35,
        pointRadius: 3,
        borderWidth: 2
      }));
      if (this.chartInstance.options.scales?.['y']) {
        this.chartInstance.options.scales['y'].min = this.yMin;
        this.chartInstance.options.scales['y'].max = this.yMax;
      }
      this.chartInstance.update();
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.borderColor,
          backgroundColor: ds.backgroundColor || 'transparent',
          tension: 0.35,
          pointRadius: 3,
          borderWidth: 2
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: { family: 'Inter', size: 12, weight: 500 }
            }
          },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' }
          },
          y: {
            min: this.yMin,
            max: this.yMax,
            grid: { color: '#e2e8f0' },
            ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b', stepSize: 10 }
          }
        }
      }
    });
  }
}
