import { Component, computed, inject, signal } from '@angular/core';

import { EventCard } from '../event-card/event-card';
import { EVENTS, HubEvent } from '../data/events';
import { Favorites } from '../services/favorites';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventCard],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventList {
  readonly events = signal<HubEvent[]>(EVENTS);
  readonly selectedCategory = signal('Tous');

  // Ce filtre supplémentaire permet aussi de tester @empty.
  readonly onlyFavorites = signal(false);

  private readonly favoritesStore = inject(Favorites);
  readonly favorites = this.favoritesStore.ids;

  readonly categories = ['Tous', 'Atelier', 'Conférence', 'Sport'];

  readonly favoriteCount = computed(() => this.favorites().length);

  readonly filteredEvents = computed(() => {
    return this.events().filter(event => {
      const categoryMatches =
        this.selectedCategory() === 'Tous' ||
        event.category === this.selectedCategory();

      const favoriteMatches =
        !this.onlyFavorites() ||
        this.favorites().includes(event.id);

      return categoryMatches && favoriteMatches;
    });
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  toggleFavorite(id: number): void {
    this.favorites.update(ids =>
      ids.includes(id)
        ? ids.filter(favoriteId => favoriteId !== id)
        : [...ids, id]
    );
  }
}