import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DashboardService, DashboardData, MonthlyData, AdSetsData } from '../../services/dashboard.service';
import { Chart, ChartConfiguration, ChartData, ChartType, BarController, BarElement, CategoryScale, LinearScale, PieController, ArcElement, LineController, LineElement, PointElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import { forkJoin } from 'rxjs';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';

// Registrar los controladores necesarios para Chart.js
Chart.register(
  BarController, BarElement, CategoryScale, LinearScale,
  PieController, ArcElement,
  LineController, LineElement, PointElement,
  DoughnutController,
  Tooltip, Legend
);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, BottomNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPage implements OnInit {
  // AdSet seleccionado para la tendencia mensual
  selectedAdSetForTrend: string = 'all';
  
  // Referencias a los elementos canvas
  @ViewChild('budgetChart', { read: ElementRef }) budgetChartRef!: ElementRef;
  @ViewChild('spendChart', { read: ElementRef }) spendChartRef!: ElementRef;
  @ViewChild('trendChart', { read: ElementRef }) trendChartRef!: ElementRef;
  
  // Instancias de los gráficos
  budgetChart: Chart | null = null;
  spendChart: Chart | null = null;
  trendChart: Chart | null = null;

  // Datos del dashboard
  dashboardData: DashboardData | null = null;
  monthlyData: MonthlyData | null = null;
  adSetsData: AdSetsData | null = null;
  isLoading = false;
  error = '';

  // Filtros
  filters = {
    startDate: '',
    endDate: '',
    adSetName: ''
  };

  // Gráfico seleccionado
  selectedMetric: 'ImporteGastado' | 'Alcance' | 'Impresiones' | 'Resultados' = 'ImporteGastado';

  // Configuraciones de los gráficos optimizadas para móvil
  budgetChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: true,
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 9
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 9
          }
        }
      }
    }
  };

  budgetChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Presupuesto diario (USD)',
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ]
    }]
  };

  spendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        display: true,
        labels: {
          boxWidth: 10,
          font: {
            size: 10
          }
        }
      }
    }
  };

  spendChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)'
      ]
    }]
  };

  trendChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 8,
        cornerRadius: 4,
        titleFont: {
          size: 11
        },
        bodyFont: {
          size: 12
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 9
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 9
          }
        }
      }
    }
  };

  trendChartData: ChartData<'line'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [{
      data: [],
      label: 'Tendencia',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      borderColor: 'rgba(147, 51, 234, 1)',
      borderWidth: 2,
      tension: 0.3,
      pointBackgroundColor: 'rgba(147, 51, 234, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      fill: true
    }]
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  ionViewDidEnter(): void {
    // Asegurar que los gráficos se actualicen cuando la vista esté completamente cargada
    if (this.dashboardData) {
      setTimeout(() => {
        this.createOrUpdateCharts();
      }, 300);
    }
  }

  private loadInitialData(): void {
    this.isLoading = true;
    this.error = '';

    const currentYear = new Date().getFullYear();

    forkJoin({
      dashboard: this.dashboardService.getDashboardData({}),
      monthly: this.dashboardService.getMonthlyData(currentYear),
      adSets: this.dashboardService.getAdSetsData()
    }).subscribe({
      next: (results) => {
        this.dashboardData = results.dashboard;
        this.monthlyData = results.monthly;
        this.adSetsData = results.adSets;

        this.updateCharts();
        this.updateTrendChart();

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar datos iniciales:', error);
        this.error = 'Error al cargar los datos. Por favor intente nuevamente.';
        this.isLoading = false;
        this.loadDataSeparately();
        this.cdr.markForCheck();
      }
    });
  }

  private loadDataSeparately(): void {
    this.loadDashboardData();
    this.loadMonthlyData();
    this.loadAdSetsData();
  }

  loadDashboardData(): void {
    const filterParams: any = {};
    if (this.filters.startDate) filterParams.startDate = this.filters.startDate;
    if (this.filters.endDate) filterParams.endDate = this.filters.endDate;
    if (this.filters.adSetName) filterParams.adSetName = this.filters.adSetName;

    this.dashboardService.getDashboardData(filterParams).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.updateCharts();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar datos del dashboard:', error);
        this.handleError(error, 'Error al cargar datos del dashboard');
        this.cdr.markForCheck();
      }
    });
  }

  loadMonthlyData(): void {
    const currentYear = new Date().getFullYear();
    this.dashboardService.getMonthlyData(currentYear).subscribe({
      next: (data) => {
        this.monthlyData = data;
        this.updateTrendChart();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar datos mensuales:', error);
        this.handleError(error, 'Error al cargar datos mensuales');
        this.cdr.markForCheck();
      }
    });
  }

  loadAdSetsData(): void {
    this.dashboardService.getAdSetsData().subscribe({
      next: (data) => {
        this.adSetsData = data;
        console.log('Datos de AdSets actualizados:', this.adSetsData);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar datos de AdSets:', error);
        this.handleError(error, 'Error al cargar datos de AdSets');
        this.cdr.markForCheck();
      }
    });
  }

  private handleError(error: any, defaultMessage: string): void {
    if (error.status === 401) {
      this.error = 'Error de autenticación. Por favor inicie sesión nuevamente.';
    } else if (error.status === 404) {
      this.error = 'No se encontraron datos.';
    } else {
      this.error = error.error?.message || defaultMessage;
    }
  }

  applyFilters(): void {
    this.loadDashboardData();
    this.loadAdSetsData();
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  updateCharts(): void {
    if (!this.dashboardData) return;

    // Actualizar gráfico de presupuesto
    const budgetLabels = Object.keys(this.dashboardData.PresupuestoDiarioPorConjunto);
    const budgetData = Object.values(this.dashboardData.PresupuestoDiarioPorConjunto);

    this.budgetChartData.labels = budgetLabels;
    this.budgetChartData.datasets[0].data = budgetData;

    // Actualizar gráfico de gasto
    const spendLabels = Object.keys(this.dashboardData.ImporteGastadoPorConjunto);
    const spendData = Object.values(this.dashboardData.ImporteGastadoPorConjunto);

    this.spendChartData.labels = spendLabels;
    this.spendChartData.datasets[0].data = spendData;

    // Crear o actualizar gráficos
    setTimeout(() => {
      this.createOrUpdateCharts();
    }, 100);
  }

  private createOrUpdateCharts(): void {
    // Gráfico de presupuesto
    if (this.budgetChartRef && this.budgetChartRef.nativeElement) {
      const ctx = this.budgetChartRef.nativeElement.getContext('2d');
      if (this.budgetChart) {
        this.budgetChart.destroy();
      }
      this.budgetChart = new Chart(ctx, {
        type: 'bar',
        data: this.budgetChartData,
        options: this.budgetChartOptions as any
      });
    }

    // Gráfico de gasto
    if (this.spendChartRef && this.spendChartRef.nativeElement) {
      const ctx = this.spendChartRef.nativeElement.getContext('2d');
      if (this.spendChart) {
        this.spendChart.destroy();
      }
      this.spendChart = new Chart(ctx, {
        type: 'doughnut',
        data: this.spendChartData,
        options: this.spendChartOptions as any
      });
    }

    // Gráfico de tendencia
    if (this.trendChartRef && this.trendChartRef.nativeElement) {
      const ctx = this.trendChartRef.nativeElement.getContext('2d');
      if (this.trendChart) {
        this.trendChart.destroy();
      }
      this.trendChart = new Chart(ctx, {
        type: 'line',
        data: this.trendChartData,
        options: this.trendChartOptions as any
      });
    }
  }

  updateTrendChart(): void {
    if (!this.monthlyData) return;

    const data = this.monthlyData[this.selectedMetric];
    this.trendChartData.datasets[0].data = data;
    this.trendChartData.datasets[0].label = this.getMetricLabel(this.selectedMetric);

    setTimeout(() => {
      if (this.trendChartRef && this.trendChartRef.nativeElement) {
        const ctx = this.trendChartRef.nativeElement.getContext('2d');
        if (this.trendChart) {
          this.trendChart.destroy();
        }
        this.trendChart = new Chart(ctx, {
          type: 'line',
          data: this.trendChartData,
          options: this.trendChartOptions as any
        });
      }
    }, 100);
  }

  onMetricChange(): void {
    this.updateTrendChart();
  }

  onAdSetChange(): void {
    this.loadMonthlyData();
    this.loadAdSetsData();
    this.cdr.markForCheck();
  }

  goToCargar(): void {
    this.router.navigate(['/cargar']);
  }

  goToIA(): void {
    this.router.navigate(['/ia']);
  }

  getMetricLabel(metric: string): string {
    const labels: { [key: string]: string } = {
      'ImporteGastado': 'Importe gastado',
      'Alcance': 'Alcance',
      'Impresiones': 'Impresiones',
      'Resultados': 'Resultados'
    };
    return labels[metric] || metric;
  }

  formatCurrency(value: number | null | undefined): string {
    if (value == null) return '$0.00';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  }

  formatNumber(value: number | null | undefined): string {
    if (value == null) return '0';
    return new Intl.NumberFormat('es-ES').format(Math.round(value));
  }

  formatPercentage(value: number | null | undefined): string {
    if (value == null) return '0.00%';
    return (value * 100).toFixed(2) + '%';
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';

      return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  }

  // Métodos helper para acceder a los datos de AdSets
  getAdSetMetricData(metric: keyof AdSetsData): { [key: string]: number } | null {
    return this.adSetsData ? this.adSetsData[metric] : null;
  }

  getTotalFromAdSetsData(metric: keyof AdSetsData): number {
    const data = this.getAdSetMetricData(metric);
    if (!data) return 0;

    return Object.values(data).reduce((sum, value) => sum + value, 0);
  }
}