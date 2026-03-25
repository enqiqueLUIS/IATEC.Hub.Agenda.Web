import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Invitation, SendInvitationRequest } from '../models/invitation.model';

interface ApiResponse<T> {
  data: T;
  messages: { type: string; description: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/invitations`;

  getPending(): Observable<Invitation[]> {
    return this.http.get<ApiResponse<Invitation[]>>(`${this.apiUrl}/pending`).pipe(map(r => r.data ?? []));
  }

  send(request: SendInvitationRequest): Observable<Invitation> {
    return this.http.post<ApiResponse<Invitation>>(`${this.apiUrl}/send`, request).pipe(map(r => r.data));
  }

  accept(id: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/accept`, {}).pipe(map(r => r.data));
  }

  reject(id: number): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/${id}/reject`, {}).pipe(map(r => r.data));
  }
}