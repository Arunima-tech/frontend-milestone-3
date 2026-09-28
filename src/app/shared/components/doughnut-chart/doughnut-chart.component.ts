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

const centerTextPlugin = {
  id: 'centerTextPlugin',
  afterDraw(chart: any) {
    const { ctx, chartArea } = chart;
    const centerText = chart.config.options.plugins?.centerText;
    if (!centerText) return;

    const { mainText, subText } = centerText;
    const centerX = (chartArea.left + chartArea.right) / 2;
    const centerY = (chartArea.top + chartArea.bottom) / 2;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (mainText) {
      ctx.font = '700 18px Inter, sans-serif';
      ctx.fillStyle = '#0f1b3d';
      ctx.fillText(mainText, centerX, centerY - 8);
    }

    if (subText) {
      ctx.font = '500 11px Inter, sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(subText, centerX, centerY + 10);
    }

    ctx.restore();
  }
};

@Component({
  selector: 'app-doughnut-chart',
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
export class DoughnutChartComponent implements OnChanges, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() colors: string[] = ['#2f6fed', '#3cb371', '#8b5cf6', '#f5a524', '#e5484d', '#94a3b8'];
  @Input() centerMainText: string = '';
  @Input() centerSubText: string = '';

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
      this.chartInstance.data.datasets[0].data = this.data;
      this.chartInstance.data.datasets[0].backgroundColor = this.colors;
      if (this.chartInstance.options.plugins) {
        (this.chartInstance.options.plugins as any).centerText = {
          mainText: this.centerMainText,
          subText: this.centerSubText
        };
      }
      this.chartInstance.update();
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      plugins: [centerTextPlugin],
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.colors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'right',
            labels: {
              usePointStyle: true,
              boxWidth: 8,
              font: { family: 'Inter', size: 12, weight: '500' }
            }
          },
          tooltip: { enabled: true },
          centerText: {
            mainText: this.centerMainText,
            subText: this.centerSubText
          }
        } as any
      }
    });
  }
}
