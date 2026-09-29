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

// Custom plugin to draw numbers on top of each vertical bar
const topValuePlugin = {
  id: 'topValuePlugin',
  afterDatasetsDraw(chart: any) {
    const { ctx } = chart;
    chart.data.datasets.forEach((dataset: any, index: number) => {
      const meta = chart.getDatasetMeta(index);
      meta.data.forEach((bar: any, i: number) => {
        const value = dataset.data[i];
        if (value !== undefined && value !== null) {
          ctx.save();
          ctx.font = '600 11px Inter, sans-serif';
          ctx.fillStyle = '#475569';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillText(value.toString(), bar.x, bar.y - 4);
          ctx.restore();
        }
      });
    });
  }
};

@Component({
  selector: 'app-vbar-chart',
  standalone: true,
  template: `
    <div class="chart-container" style="position: relative; height: 320px; width: 100%;">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    .chart-container {
      position: relative;
      width: 100%;
      height: 320px;
    }
  `]
})
export class VbarChartComponent implements OnChanges, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() color: string = '#2f6fed';

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
      this.chartInstance.data.datasets[0].data = this.values;
      this.chartInstance.data.datasets[0].backgroundColor = this.color;
      this.chartInstance.update();
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      plugins: [topValuePlugin],
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.values,
            backgroundColor: this.color,
            borderRadius: { topLeft: 6, topRight: 6 },
            barThickness: 28
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: 500 },
              color: '#475569',
              maxRotation: 45,
              minRotation: 0,
              autoSkip: true
            }
          },
          y: {
            beginAtZero: true,
            min: 0,
            grid: { color: '#e3e8f0' },
            ticks: {
              font: { family: 'Inter', size: 11, weight: 500 },
              color: '#64748b'
            }
          }
        }
      }
    });
  }
}
