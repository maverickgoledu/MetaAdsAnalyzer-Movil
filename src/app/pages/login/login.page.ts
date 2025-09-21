import { Component, ChangeDetectorRef } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, IonicModule, RouterModule, HttpClientModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  onSubmit() {
    this.emailError = '';
    this.passwordError = '';
    this.error = '';
    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.email) {
      this.emailError = 'El correo es obligatorio.';
      hasError = true;
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'El formato del correo no es válido.';
      hasError = true;
    }

    if (!this.password) {
      this.passwordError = 'La contraseña es obligatoria.';
      hasError = true;
    }

    if (hasError) {
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    this.authService.login(this.email, this.password).subscribe({
      next: async (res) => {
        this.loading = false;
        // Detectar si es móvil (Capacitor) o web
        const isMobile = !!(window && (window as any).Capacitor && (window as any).Capacitor.isNativePlatform());
        if (res.access_token) {
          if (isMobile) {
            await Preferences.set({ key: 'access_token', value: res.access_token });
          } else {
            localStorage.setItem('access_token', res.access_token);
          }
        }
        if (res.user) {
          if (isMobile) {
            await Preferences.set({ key: 'user', value: JSON.stringify(res.user) });
            await Preferences.set({ key: 'userId', value: res.user.id });
          } else {
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('userId', res.user.id);
          }
        }
        this.cdr.markForCheck();
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.loading = false;
        this.emailError = '';
        this.passwordError = '';
        this.error = '';

        if (err.status === 401 && err.error?.error) {
          this.emailError = err.error.error;
        } else if (err.status === 0) {
          this.error = 'Error de conexión. Verifica tu conexión a internet.';
        } else {
          this.error = 'Error inesperado. Intenta nuevamente.';
        }

        console.log('Error asignado - loading:', this.loading);
        console.log('Error asignado - emailError:', this.emailError);

        this.cdr.markForCheck();
      }
    });
  }
}
