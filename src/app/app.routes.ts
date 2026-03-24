import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EventsComponent } from './pages/events/events.component';
import { InvitationsComponent } from './pages/invitations/invitations.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'events', component: EventsComponent, canActivate: [authGuard] },
  { path: 'invitations', component: InvitationsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/login' }
];
