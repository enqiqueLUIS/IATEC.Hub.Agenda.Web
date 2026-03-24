import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvitationService } from '../../services/invitation.service';
import { EventService } from '../../services/event.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Invitation, SendInvitationRequest } from '../../models/invitation.model';
import { Event } from '../../models/event.model';
import { User } from '../../models/user.model';
import { ButtonComponent, SpinnerComponent, type SelectOption } from '../../shared/components';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SpinnerComponent],
  templateUrl: './invitations.component.html'
})
export class InvitationsComponent implements OnInit {
  invitations = signal<Invitation[]>([]);
  events = signal<Event[]>([]);
  users = signal<User[]>([]);
  loading = signal(true);
  showModal = signal(false);

  selectedEventId = signal<number | null>(null);
  selectedUserId = signal<number | null>(null);

  eventOptions = computed<SelectOption[]>(() =>
    this.events().map(event => ({ value: event.id, label: event.title }))
  );

  userOptions = computed<SelectOption[]>(() =>
    this.users().map(user => ({ value: user.id, label: `${user.name} (${user.email})` }))
  );

  // Signals for SelectComponent
  eventLabel = signal('Evento');
  eventPlaceholder = signal('Selecciona un evento');
  userLabel = signal('Usuario');
  userPlaceholder = signal('Selecciona un usuario');
  selectSize = signal<'sm' | 'md' | 'lg'>('md');

  selectedEventValue = computed(() => this.selectedEventId()?.toString() || '');
  selectedUserValue = computed(() => this.selectedUserId()?.toString() || '');

  // Signals for SpinnerComponent
  spinnerText = signal('Cargando...');
  spinnerSize = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  spinnerCentered = signal(true);

  constructor(
    private invitationService: InvitationService,
    private eventService: EventService,
    private userService: UserService,
    public authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.invitationService.getPending().subscribe({
      next: (data) => {
        this.invitations.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('No se pudieron cargar las invitaciones.');
        this.loading.set(false);
      }
    });
  }

  openSendModal(): void {
    this.eventService.getAll().subscribe({
      next: (events) => this.events.set(events)
    });
    this.userService.getAll().subscribe({
      next: (users) => this.users.set(users.filter(u => u.id !== this.authService.currentUser()?.id))
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedEventId.set(null);
    this.selectedUserId.set(null);
  }

  sendInvitation(): void {
    const eventId = this.selectedEventId();
    const userId = this.selectedUserId();

    if (!eventId || !userId) {
      this.toast.warning('Debes seleccionar un evento y un usuario.');
      return;
    }

    const request: SendInvitationRequest = { eventId, invitedUserId: userId };

    this.invitationService.send(request).subscribe({
      next: () => {
        this.closeModal();
        this.loadData();
        this.toast.success('Invitación enviada correctamente.');
      },
      error: (err) => {
        const msg = err.error?.messages?.[0]?.description || 'Error al enviar la invitación.';
        this.toast.error(msg);
      }
    });
  }

  acceptInvitation(id: number): void {
    this.invitationService.accept(id).subscribe({
      next: () => {
        this.loadData();
        this.toast.success('Invitación aceptada. El evento fue agregado a tu agenda.');
      },
      error: () => this.toast.error('Error al aceptar la invitación.')
    });
  }

  rejectInvitation(id: number): void {
    this.invitationService.reject(id).subscribe({
      next: () => {
        this.loadData();
        this.toast.info('Invitación rechazada.');
      },
      error: () => this.toast.error('Error al rechazar la invitación.')
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Pending':  return 'Pendiente';
      case 'Accepted': return 'Aceptada';
      case 'Rejected': return 'Rechazada';
      default: return 'Desconocido';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Pending':  return 'bg-yellow-100 text-yellow-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  goToDashboard(): void { this.router.navigate(['/dashboard']); }
  logout(): void { this.authService.logout(); }
}