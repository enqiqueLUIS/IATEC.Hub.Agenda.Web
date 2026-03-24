import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { DashboardEvent } from '../../models/dashboard.model';
import { ButtonComponent, SpinnerComponent } from '../../shared/components';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SpinnerComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  ongoingEvents = signal<DashboardEvent[]>([]);
  upcomingEvents = signal<DashboardEvent[]>([]);
  loading = signal(true);

  // Signals for SpinnerComponent
  spinnerText = signal('Cargando...');
  spinnerSize = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  spinnerCentered = signal(true);

  constructor(
    private dashboardService: DashboardService,
    public authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.ongoingEvents.set(data.ongoingEvents ?? []);
        this.upcomingEvents.set(data.upcomingEvents ?? []);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Error al cargar el dashboard.');
        this.loading.set(false);
      }
    });
  }

  logout(): void { this.authService.logout(); }
  navigateToEvents(): void { this.router.navigate(['/events']); }
  navigateToInvitations(): void { this.router.navigate(['/invitations']); }
}