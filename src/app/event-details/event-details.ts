import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

import { HubEvent } from '../data/events';
import { EventService } from '../services/event-service';

interface DetailsState {
  loading: boolean;
  event: HubEvent | null;
  error: string;
}

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(EventService);

  readonly state = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));

        if (!Number.isInteger(id) || id <= 0) {
          return of<DetailsState>({
            loading: false,
            event: null,
            error: 'Identifiant invalide.'
          });
        }

        return this.service.getEventById(id).pipe(
          map((event): DetailsState => ({
            loading: false,
            event,
            error: ''
          })),
          catchError(error =>
            of<DetailsState>({
              loading: false,
              event: null,
              error: error.status === 404
              ? 'Cet événement n’existe pas ou a été supprimé.'
                : 'Chargement impossible. Vérifiez que l’API est démarrée.'
            })
          ),
          startWith<DetailsState>({
            loading: true,
            event: null,
            error: ''
          })
        );
      })
    ),
    {
      initialValue: {
        loading: true,
        event: null,
        error: ''
      } as DetailsState
    }
  );
}
