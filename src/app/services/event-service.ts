import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { HubEvent } from '../data/events';

@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly apiUrl = 'http://localhost:3000/events';
  private readonly _events = signal<HubEvent[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly events = this._events.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly count = computed(() => this._events().length);

  constructor(private readonly http: HttpClient) {}

  load(): void {
    this._loading.set(true);
    this._error.set(null);
    this.getAllEvents().subscribe({
      next: events => {
        this._events.set(events);
        this._loading.set(false);
      },
      error: () => {
        this._error.set('Impossible de charger les événements. Vérifiez que l’API est démarrée.');
        this._loading.set(false);
      }
    });
  }

  getAllEvents(): Observable<HubEvent[]> {
    return this.http.get<HubEvent[]>(this.apiUrl);
  }

  getEventById(id: number): Observable<HubEvent> {
    return this.http.get<HubEvent>(`${this.apiUrl}/${id}`);
  }

  create(event: Omit<HubEvent, 'id'>): Observable<HubEvent> {
    this._error.set(null);
    return this.http.post<HubEvent>(this.apiUrl, event).pipe(
      tap(created => this._events.update(events => [...events, created]))
    );
  }

  update(id: number, event: Omit<HubEvent, 'id'>): Observable<HubEvent> {
    this._error.set(null);
    return this.http.put<HubEvent>(`${this.apiUrl}/${id}`, { ...event, id }).pipe(
      tap(updated => this._events.update(events =>
        events.map(current => current.id === id ? updated : current)
      ))
    );
  }

  remove(id: number): Observable<void> {
    this._error.set(null);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this._events.update(events => events.filter(event => event.id !== id)))
    );
  }
}
