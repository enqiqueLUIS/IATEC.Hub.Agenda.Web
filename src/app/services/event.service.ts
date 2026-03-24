import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  getAll(filterDate?: string, searchCriteria?: string): Observable<Event[]> {
    let params = new HttpParams();
    if (filterDate) params = params.set('filterDate', filterDate);
    if (searchCriteria) params = params.set('searchCriteria', searchCriteria);
    return this.http.get<ApiResponse<Event[]>>(this.apiUrl, { params }).pipe(map(r => r.data ?? []));
  }

  getById(id: number): Observable<Event> {
    return this.http.get<ApiResponse<Event>>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
  }

  create(event: CreateEventRequest): Observable<Event> {
    return this.http.post<ApiResponse<Event>>(this.apiUrl, event).pipe(map(r => r.data));
  }

  update(event: UpdateEventRequest): Observable<void> {
    return this.http.put<ApiResponse<void>>(this.apiUrl, event).pipe(map(r => r.data));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(map(r => r.data));
  }
}