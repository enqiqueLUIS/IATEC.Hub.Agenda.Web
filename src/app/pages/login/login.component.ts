import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';
import { ButtonComponent, InputComponent } from '../../shared/components';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, InputComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  error = signal<string | null>(null);
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  fillTestCredentials(): void {
    this.email = 'admin@agenda.com';
    this.password = 'admin123';
  }

  onSubmit(): void {
    this.error.set(null);
    this.loading.set(true);

    const request: LoginRequest = {
      email: this.email,
      password: this.password
    };

    console.log('Intentando login con:', request);

    this.authService.login(request).subscribe({
      next: () => {
        console.log('Login exitoso');
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al iniciar sesión');
      }
    });
  }
}
