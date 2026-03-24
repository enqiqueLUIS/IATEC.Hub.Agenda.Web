import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Event, CreateEventRequest, UpdateEventRequest } from '../models/event.model';

interface ApiResponse<T> {
  data: T;
  messages: { type: string; description: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Event[]> {
    return this.http.get<ApiResponse<Event[]>>(this.apiUrl).pipe(map(r => r.data ?? []));
  }

  getById(id: number): Observable<Event> {
    return this.http.get<ApiResponse<Event>>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
  }

  create(event: CreateEventRequest): Observable<Event> {
    return this.http.post<ApiResponse<Event>>(this.apiUrl, event).pipe(map(r => r.data));
  }

  update(id: number, event: UpdateEventRequest): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/${id}`, event).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
  }
}