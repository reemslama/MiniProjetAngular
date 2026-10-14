import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { EVENTS } from '../data/events';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails {
  private readonly route = inject(ActivatedRoute);

  private readonly params = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  readonly event = computed(() => {
    const id = Number(this.params().get('id'));
    return EVENTS.find(event => event.id === id);
  });
}