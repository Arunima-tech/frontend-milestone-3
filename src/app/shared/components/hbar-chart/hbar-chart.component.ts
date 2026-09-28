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

const endValuePlugin = {
  id: 'endValuePlugin',
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
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(value.toString(), bar.x + 6, bar.y);
          ctx.restore();
        }
      });
    });
  }
};

@Component({
  selector: 'app-hbar-chart',
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
export class HbarChartComponent implements OnChanges, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() selectedDepartment: string = 'All Departments';
  @Input() primaryColor: string = '#2f6fed';
  @Input() dimmedColor: string = 'rgba(47, 111, 237, 0.25)';

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

    const backgroundColors = this.labels.map(label => {
      if (!this.selectedDepartment || this.selectedDepartment === 'All Departments') {
        return this.primaryColor;
      }
      return label.toLowerCase() === this.selectedDepartment.toLowerCase()
        ? this.primaryColor
        : this.dimmedColor;
    });

    if (this.chartInstance) {
      this.chartInstance.data.labels = this.labels;
      this.chartInstance.data.datasets[0].data = this.data;
      this.chartInstance.data.datasets[0].backgroundColor = backgroundColors;
      this.chartInstance.update();
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      plugins: [endValuePlugin],
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: backgroundColors,
            borderRadius: 4,
            barThickness: 14
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            right: 32
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            display: false,
            grid: { display: false }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', size: 11, weight: 500 },
              color: '#475569'
            }
          }
        }
      }
    });
  }
}
