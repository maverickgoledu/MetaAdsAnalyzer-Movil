import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController, ToastController } from '@ionic/angular';
import { UsersService } from '../../services/users.service';
import { BottomNavComponent } from '../../components/bottom-nav/bottom-nav.component';


interface User {
  Username: string;
  Email: string;
  Role: string;
  IsActive: boolean;
  CreatedAt: string;
  LastLogin: string;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  templateUrl: './usuarios.page.html',
  imports: [CommonModule, FormsModule, IonicModule, BottomNavComponent],
  styleUrls: ['./usuarios.page.scss']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  roleFilter: string = '';
  statusFilter: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  Math = Math; // Para usar Math en el template
  private intervalId: any;

  // Filtros visuales
  showFilters: boolean = false;
  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  // Gradiente para avatar
  getGradientColor(username: string): string {
    // Genera un gradiente basado en el hash del username
    const colors = [
      ['#667eea', '#764ba2'],
      ['#43cea2', '#185a9d'],
      ['#ff6a00', '#ee0979'],
      ['#36d1c4', '#5b86e5'],
      ['#fc5c7d', '#6a82fb']
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return `linear-gradient(to right, ${colors[idx][0]}, ${colors[idx][1]})`;
  }

  // Modal y formulario de creación de usuario
  showCreateUserModal: boolean = false;
  loadingCreateUser: boolean = false;
  createUserError: string = '';
  newUser: any = {
    Username: '',
    Email: '',
    Password: '',
    Role: 'Usuario',
    IsActive: true
  };
  isEditMode: boolean = false;
  editUserId: string | null = null;

  constructor(
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.intervalId = setInterval(() => this.fetchUsers(), 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  openCreateUserModal(): void {
    this.showCreateUserModal = true;
    this.createUserError = '';
    this.isEditMode = false;
    this.editUserId = null;
    this.newUser = {
      Username: '',
      Email: '',
      Password: '',
      Role: 'Usuario',
      IsActive: true
    };
  }

  openEditUserModal(user: any): void {
    this.showCreateUserModal = true;
    this.createUserError = '';
    this.isEditMode = true;
    this.editUserId = user.id || user._id || user.Id || user.ID;
    this.newUser = {
      Username: user.Username,
      Email: user.Email,
      Password: '', // No se muestra el password actual
      Role: user.Role,
      IsActive: user.IsActive
    };
  }

  closeCreateUserModal(): void {
    this.showCreateUserModal = false;
    this.createUserError = '';
    this.loadingCreateUser = false;
    this.isEditMode = false;
    this.editUserId = null;
  }

  async submitCreateUser(): Promise<void> {
    if (this.loadingCreateUser) return;
    
    this.ngZone.run(() => {
      this.loadingCreateUser = true;
      this.createUserError = '';
    });

    if (this.isEditMode && this.editUserId) {
      // Editar usuario
      const userToUpdate = { ...this.newUser };
      if (!userToUpdate.Password) {
        delete userToUpdate.Password; // No enviar password si está vacío
      }
      
      this.usersService.updateUser(this.editUserId, userToUpdate).subscribe({
        next: async (res: any) => {
          this.ngZone.run(() => {
            this.loadingCreateUser = false;
            this.closeCreateUserModal();
            this.fetchUsers();
            this.cdr.detectChanges();
            this.cdr.markForCheck();
          });
          
          await this.presentToast('Usuario editado correctamente', 'success');
        },
        error: async (err: any) => {
          this.loadingCreateUser = false;
          this.createUserError = err?.error?.message || err?.error?.error || 'Error al editar usuario';
          this.cdr.detectChanges();
          this.cdr.markForCheck();
          
          await this.presentToast(this.createUserError, 'danger');
        }
      });
    } else {
      // Crear usuario
      this.usersService.createUser(this.newUser).subscribe({
        next: async (res: any) => {
          this.ngZone.run(() => {
            this.loadingCreateUser = false;
            this.closeCreateUserModal();
            this.fetchUsers();
          });
          
          await this.presentToast('Usuario creado correctamente', 'success');
        },
        error: async (err: any) => {
          this.loadingCreateUser = false;
          this.createUserError = err?.error?.message || err?.error?.error || 'Error al crear usuario';
          this.cdr.detectChanges();
          this.cdr.markForCheck();
          
          await this.presentToast(this.createUserError, 'danger');
        }
      });
    }
  }

  fetchUsers() {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : (data.users || []);
        this.filterUsers(); // Aplicar filtros después de obtener usuarios
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
        this.users = [];
        this.filteredUsers = [];
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      }
    });
  }

  // Métodos para las estadísticas
  getActiveUsers(): number {
    return this.users.filter(u => u.IsActive).length;
  }

  getAdminCount(): number {
    return this.users.filter(u => u.Role === 'Admin').length;
  }

  getRecentUsers(): number {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.users.filter(u => new Date(u.CreatedAt) > sevenDaysAgo).length;
  }

  // Método para filtrar usuarios
  filterUsers(): void {
    // Primero filtrar todos los usuarios sin paginación
    const filtered = this.users.filter(user => {
      const matchesSearch = !this.searchTerm ||
        user.Username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.Email.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRole = !this.roleFilter || user.Role === this.roleFilter;

      const matchesStatus = !this.statusFilter ||
        (this.statusFilter === 'active' && user.IsActive) ||
        (this.statusFilter === 'inactive' && !user.IsActive);

      return matchesSearch && matchesRole && matchesStatus;
    });

    // Guardar todos los usuarios filtrados (sin paginar)
    this.filteredUsers = filtered;

    // Resetear a la primera página cuando se aplican filtros
    this.currentPage = 1;
  }

  // Método para obtener tiempo relativo
  getRelativeTime(date: string): string {
    if (!date) return 'Nunca';

    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} ${Math.floor(diffDays / 7) === 1 ? 'semana' : 'semanas'}`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} ${Math.floor(diffDays / 30) === 1 ? 'mes' : 'meses'}`;

    return past.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Métodos de paginación
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Métodos para acciones de usuario
  editUser(user: User): void {
    this.openEditUserModal(user);
  }

  async deleteUser(user: User): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Eliminar usuario ${user.Username}? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            const userId = (user as any).id || (user as any)._id || (user as any).Id || (user as any).ID;
            this.usersService.deleteUser(userId).subscribe({
              next: async () => {
                this.fetchUsers();
                await this.presentToast('Usuario eliminado correctamente', 'success');
              },
              error: async (err) => {
                const errorMessage = err?.error?.message || err?.error?.error || 'Error al eliminar usuario';
                await this.presentToast(errorMessage, 'danger');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // Método auxiliar para mostrar toasts
  async presentToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2500,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}