import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { IaAnalysisService, AnalysisResponse, AnalysisRequest } from '../../services/ia.service';
import { DashboardService } from '../../services/dashboard.service';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';


@Component({
  selector: 'app-ia',
  templateUrl: './ia.page.html',
  styleUrls: ['./ia.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule, BottomNavComponent],
  providers: [DashboardService, IaAnalysisService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IaPage implements OnInit {
  // Estado del análisis
  analysisData: AnalysisResponse | null = null;
  isLoading = false;
  error = '';

  // Filtros del formulario
  filters: AnalysisRequest = {
    startDate: this.getDefaultStartDate(),
    endDate: this.getDefaultEndDate(),
    adSetName: ''
  };

  // Lista de conjuntos de anuncios disponibles
  availableAdSets: string[] = [];

  constructor(
    private iaAnalysisService: IaAnalysisService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAvailableAdSets();
  }

  loadAvailableAdSets(): void {
    this.dashboardService.getDashboardData({}).subscribe({
      next: (data) => {
        this.availableAdSets = data.AvailableAdSets || [];
        console.log('Conjuntos de anuncios cargados:', this.availableAdSets);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al cargar los conjuntos de anuncios:', error);
        this.handleError(error, 'Error al cargar los conjuntos de anuncios');
      }
    });
  }

  async generateAnalysis(): Promise<void> {
    // Validar formulario
    const validationError = this.validateFilters();
    if (validationError) {
      this.error = validationError;
      await this.showErrorAlert(validationError);
      return;
    }

    this.isLoading = true;
    this.error = '';

    console.log('Enviando análisis con filtros:', this.filters);

    this.iaAnalysisService.generateAnalysis(this.filters).subscribe({
      next: (response) => {
        console.log('Respuesta del análisis recibida:', response);
        this.analysisData = response;

        // Actualizar la lista de AdSets si viene en la respuesta
        if (response.AvailableAdSets?.length > 0) {
          this.updateAvailableAdSets(response.AvailableAdSets);
        }

        this.isLoading = false;
        this.showSuccessToast();
        this.cdr.markForCheck();
      },
      error: async (error) => {
        console.error('Error al generar el análisis:', error);
        this.isLoading = false;
        await this.handleAnalysisError(error);
        this.cdr.markForCheck();
      }
    });
  }

  private validateFilters(): string | null {
    if (!this.filters.startDate || !this.filters.endDate) {
      return 'Por favor seleccione las fechas de inicio y fin';
    }

    if (new Date(this.filters.startDate) > new Date(this.filters.endDate)) {
      return 'La fecha de inicio no puede ser posterior a la fecha de fin';
    }

    return null;
  }

  private updateAvailableAdSets(newAdSets: string[]): void {
    this.availableAdSets = newAdSets;

    // Si el adSetName actual no está en la nueva lista, lo limpiamos
    if (this.filters.adSetName && !this.availableAdSets.includes(this.filters.adSetName)) {
      this.filters.adSetName = '';
    }

    console.log('AdSets actualizados:', this.availableAdSets);
  }

  private async handleAnalysisError(error: any): Promise<void> {
    let errorMessage = 'Error al generar el análisis. Por favor intente nuevamente.';

    switch (error.status) {
      case 401:
        errorMessage = 'Error de autenticación. API Key inválida.';
        break;
      case 404:
        errorMessage = error.error?.error || 'No hay datos disponibles para los filtros seleccionados.';
        if (errorMessage === 'No hay datos disponibles para los filtros seleccionados.') {
          await this.showNoDataAlert();
          return;
        }
        break;
      default:
        if (error.error?.error) {
          errorMessage = error.error.error;
        }
    }

    this.error = errorMessage;
    await this.showErrorAlert(errorMessage);
  }

  private handleError(error: any, defaultMessage: string): void {
    const errorMessage = error.error?.error || error.message || defaultMessage;
    this.error = errorMessage;
    this.cdr.markForCheck();
  }

  private async showNoDataAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sin datos',
      message: 'No hay datos disponibles para los filtros seleccionados.',
      buttons: ['Entendido']
    });
    await alert.present();
  }

  private async showErrorAlert(message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['Cerrar']
    });
    await alert.present();
  }

  private async showSuccessToast(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Análisis generado exitosamente',
      duration: 2000,
      position: 'bottom',
      color: 'success',
      icon: 'checkmark-circle-outline'
    });
    await toast.present();
  }

  clearFilters(): void {
    this.filters = {
      startDate: this.getDefaultStartDate(),
      endDate: this.getDefaultEndDate(),
      adSetName: ''
    };
    this.analysisData = null;
    this.error = '';
    this.cdr.markForCheck();
  }

  // Copiar análisis al portapapeles
  async copyAnalysis(): Promise<void> {
    if (this.analysisData?.Analysis) {
      try {
        await Clipboard.write({
          string: this.analysisData.Analysis
        });

        const toast = await this.toastController.create({
          message: 'Análisis copiado al portapapeles',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        console.error('Error al copiar:', error);
      }
    }
  }

  // Compartir análisis
  async shareAnalysis(): Promise<void> {
    if (this.analysisData?.Analysis) {
      try {
        await Share.share({
          title: 'Análisis IA - Meta ADS',
          text: this.analysisData.Analysis,
          dialogTitle: 'Compartir análisis'
        });
      } catch (error) {
        console.error('Error al compartir:', error);
      }
    }
  }

  // Métodos de formateo
  formatCurrency(value: number | null | undefined): string {
    if (value == null) return '$0.00';

    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  formatNumber(value: number | null | undefined): string {
    if (value == null) return '0';

    return new Intl.NumberFormat('es-ES').format(Math.round(value));
  }

  formatMarkdownIonic(text: string | null | undefined): string {
    if (!text) return '';

    let html = text;

    // Escapar caracteres HTML peligrosos
    html = html.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;');

    // Headers con clases de Ionic
    html = html.replace(/^### (.*?)$/gm, '<h3 class="ion-text-dark ion-margin-top">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="ion-text-dark ion-margin-top">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="ion-text-dark ion-margin-top">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Itálicas
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Listas numeradas
    const orderedListRegex = /^\d+\.\s+(.*)$/gm;
    html = html.replace(orderedListRegex, '<oli>$1</oli>');

    // Listas con viñetas
    const unorderedListRegex = /^[-*]\s+(.*)$/gm;
    html = html.replace(unorderedListRegex, '<uli>$1</uli>');

    // Saltos de línea
    html = html.replace(/\n/g, '<br>');

    // Convertir marcadores temporales a listas reales
    html = html.replace(/(<oli>.*?<\/oli>(<br>)?)+/g, (match) => {
      const items = match.replace(/<br>/g, '').replace(/<oli>/g, '<li>').replace(/<\/oli>/g, '</li>');
      return `<ol class="ion-padding-start">${items}</ol>`;
    });

    html = html.replace(/(<uli>.*?<\/uli>(<br>)?)+/g, (match) => {
      const items = match.replace(/<br>/g, '').replace(/<uli>/g, '<li>').replace(/<\/uli>/g, '</li>');
      return `<ul class="ion-padding-start">${items}</ul>`;
    });

    // Párrafos
    html = html.replace(/^([^<].+)$/gm, '<p class="ion-margin-bottom">$1</p>');

    return `<div class="ion-text-wrap">${html}</div>`;
  }

  private getDefaultStartDate(): string {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    return this.formatDateForInput(firstDay);
  }

  private getDefaultEndDate(): string {
    return this.formatDateForInput(new Date());
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy(): void {
    // Si agregas suscripciones manuales en el futuro, desuscríbete aquí
  }
}