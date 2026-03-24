import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Event, CreateEventRequest, UpdateEventRequest } from '../../models/event.model';
import { ButtonComponent, ModalComponent, SpinnerComponent } from '../../shared/components';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ModalComponent, SpinnerComponent],
  templateUrl: './events.component.html'
})
export class EventsComponent implements OnInit {
  events = signal<Event[]>([]);
  loading = signal(true);
  showModal = signal(false);
  editMode = signal(false);
  filterDate = signal('');
  searchCriteria = signal('');
  showConfirmDelete = signal(false);
  eventToDeleteId = signal<number | null>(null);

  currentEventId = signal<number | null>(null);
  title = signal('');
  description = signal('');
  startDate = signal('');
  endDate = signal('');
  eventType = signal('Shared');
  location = signal('');

  spinnerText = signal('Cargando...');
  spinnerSize = signal<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');
  spinnerCentered = signal(true);

  get minDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.toISOString().substring(0, 16);
  }

  constructor(
    private eventService: EventService,
    public authService: AuthService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading.set(true);
    this.eventService.getAll(this.filterDate() || undefined, this.searchCriteria() || undefined).subscribe({
      next: (data) => {
        this.events.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('No se pudieron cargar los eventos.');
        this.loading.set(false);
      }
    });
  }

  clearFilters(): void {
    this.filterDate.set('');
    this.searchCriteria.set('');
    this.loadEvents();
  }

  openCreateModal(): void {
    this.editMode.set(false);
    this.currentEventId.set(null);
    this.title.set('');
    this.description.set('');
    this.startDate.set('');
    this.endDate.set('');
    this.eventType.set('Shared');
    this.location.set('');
    this.showModal.set(true);
  }

  openEditModal(event: Event): void {
    this.editMode.set(true);
    this.currentEventId.set(event.id);
    this.title.set(event.title);
    this.description.set(event.description);
    this.startDate.set(event.startDate.substring(0, 16));
    this.endDate.set(event.endDate.substring(0, 16));
    this.eventType.set(event.eventType ?? 'Shared');
    this.location.set(event.location ?? '');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveEvent(): void {
    if (this.editMode()) {
      this.updateEvent();
    } else {
      this.createEvent();
    }
  }

  createEvent(): void {
    const request: CreateEventRequest = {
      title: this.title(),
      description: this.description(),
      startDate: new Date(this.startDate()).toISOString(),
      endDate: new Date(this.endDate()).toISOString(),
      eventType: this.eventType(),
      location: this.location() || undefined
    };

    this.eventService.create(request).subscribe({
      next: () => {
        this.closeModal();
        this.loadEvents();
        this.toast.success('Evento creado correctamente.');
      },
      error: (err) => {
        const msg = err.error?.messages?.[0]?.description || 'Error al crear el evento.';
        this.toast.error(msg);
      }
    });
  }

  updateEvent(): void {
    const id = this.currentEventId();
    if (!id) return;

    const request: UpdateEventRequest = {
      id,
      title: this.title(),
      description: this.description(),
      startDate: new Date(this.startDate()).toISOString(),
      endDate: new Date(this.endDate()).toISOString(),
      eventType: this.eventType(),
      location: this.location() || undefined
    };

    this.eventService.update(request).subscribe({
      next: () => {
        this.closeModal();
        this.loadEvents();
        this.toast.update('Evento actualizado correctamente.');
      },
      error: (err) => {
        const msg = err.error?.messages?.[0]?.description || 'Error al actualizar el evento.';
        this.toast.error(msg);
      }
    });
  }

  deleteEvent(id: number): void {
    this.eventToDeleteId.set(id);
    this.showConfirmDelete.set(true);
  }

  confirmDelete(): void {
    const id = this.eventToDeleteId();
    if (!id) return;
    this.showConfirmDelete.set(false);
    this.eventService.delete(id).subscribe({
      next: () => {
        this.loadEvents();
        this.toast.delete('Evento eliminado.');
      },
      error: () => {
        this.toast.error('Error al eliminar el evento.');
      }
    });
  }

  cancelDelete(): void {
    this.showConfirmDelete.set(false);
    this.eventToDeleteId.set(null);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    this.authService.logout();
  }
}