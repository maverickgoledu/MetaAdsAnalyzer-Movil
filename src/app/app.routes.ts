import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'usuarios',
  loadComponent: () => import('./pages/usuarios/usuarios.page').then(m => m.UsuariosComponent),
  },
  {
    path: 'login',
  loadComponent: () => import('./pages/login/login.page').then(m => m.LoginComponent),
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage),
  },
  {
    path: 'ia',
    loadComponent: () => import('./pages/ia/ia.page').then(m => m.IaPage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
  },
  {
  path: 'ia',
  loadComponent: () => import('./pages/ia/ia.page').then(m => m.IaPage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
