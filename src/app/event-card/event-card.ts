import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { HubEvent } from '../data/events';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, RouterLink],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css'
})
export class EventCard {
  event = input.required<HubEvent>();
  isFavorite = input(false);

  favoriteToggle = output<number>();
}