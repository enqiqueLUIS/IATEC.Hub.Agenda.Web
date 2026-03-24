import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  public currentUser = signal<User | null>(this.getUserFromStorage());
  public isAuthenticated = signal<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, request).pipe(
      tap(response => {
        const data = response.data;
        this.setToken(data.token);
        const user: User = { id: data.userId, name: data.name, email: data.email };
        this.setUser(user);
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson || userJson === 'undefined' || userJson === 'null') {
      return null;
    }
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
