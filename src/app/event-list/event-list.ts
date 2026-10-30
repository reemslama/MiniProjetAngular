import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EventCard } from '../event-card/event-card';
import { HubEvent } from '../data/events';
import { Favorites } from '../services/favorites';
import { EventService } from '../services/event-service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventCard, ReactiveFormsModule],
  templateUrl: './event-list.html',
  styleUrl: './event-list.css'
})
export class EventList implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly favoritesStore = inject(Favorites);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);

  // Données et chargement fournis par le service.
  readonly events = this.eventService.events;
  readonly loading = this.eventService.loading;

  readonly favorites = this.favoritesStore.ids;

  readonly saving = signal(false);
  readonly deletingId = signal<number | null>(null);

  private readonly actionError = signal('');

  // Afficher une erreur de chargement ou une erreur de modification.
  readonly error = computed(() =>
    this.actionError() || this.eventService.error()
  );

  readonly message = signal('');

  readonly formVisible = signal(false);
  readonly editingId = signal<number | null>(null);

  readonly selectedCategory = signal('Tous');
  readonly onlyFavorites = signal(false);

  readonly categories = [
    'Tous',
    'Atelier',
    'Conférence',
    'Sport'
  ];

  // Compter seulement les favoris présents dans le catalogue.
  readonly favoriteCount = computed(() =>
    this.events().filter(event =>
      this.favorites().includes(event.id)
    ).length
  );

  readonly filteredEvents = computed(() =>
    this.events().filter(event => {
      const categoryMatches =
        this.selectedCategory() === 'Tous' ||
        event.category === this.selectedCategory();

      const favoriteMatches =
        !this.onlyFavorites() ||
        this.favorites().includes(event.id);

      return categoryMatches && favoriteMatches;
    })
  );

  readonly form = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.pattern(/\S/)]
    ],
    category: ['Atelier', Validators.required],
    date: ['', Validators.required],
    place: [
      '',
      [Validators.required, Validators.pattern(/\S/)]
    ],
    price: [
      0,
      [Validators.required, Validators.min(0)]
    ],
    imageUrl: [
      '',
      [Validators.required, Validators.pattern(/\S/)]
    ],
    description: [
      '',
      [Validators.required, Validators.pattern(/\S/)]
    ]
  });

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.actionError.set('');
    this.eventService.load();
  }

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

  openAddForm(): void {
    this.editingId.set(null);
    this.form.reset();
    this.actionError.set('');
    this.message.set('');
    this.formVisible.set(true);
    this.focusForm();
  }

  openEditForm(event: HubEvent): void {
    this.editingId.set(event.id);

    this.form.reset({
      title: event.title,
      category: event.category,
      date: event.date.slice(0, 10),
      place: event.place,
      price: event.price,
      imageUrl: event.imageUrl,
      description: event.description
    });

    this.actionError.set('');
    this.message.set('');
    this.formVisible.set(true);
    this.focusForm();
  }

  private focusForm(): void {
    setTimeout(() => {
      const panel = this.document.getElementById('event-form-panel');
      panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      panel?.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input, select, textarea'
      )?.focus({ preventScroll: true });
    });
  }

  closeForm(): void {
    this.formVisible.set(false);
    this.editingId.set(null);
    this.form.reset();
  }

  save(): void {
    if (this.saving() || this.deletingId() !== null) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.getRawValue();

    const data: Omit<HubEvent, 'id'> = {
      ...values,
      title: values.title.trim(),
      place: values.place.trim(),
      imageUrl: values.imageUrl.trim(),
      description: values.description.trim()
    };

    const id = this.editingId();

    // Ces deux méthodes retournent un Observable.
    const request = id === null
      ? this.eventService.create(data)
      : this.eventService.update(id, data);

    this.saving.set(true);
    this.actionError.set('');
    this.message.set('');

    request
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();

          this.selectedCategory.set('Tous');
          this.onlyFavorites.set(false);

          this.message.set(
            id === null
              ? 'Événement ajouté avec succès.'
              : 'Événement modifié avec succès.'
          );

        },
        error: () => {
          this.saving.set(false);

          this.actionError.set(
            'Enregistrement impossible. Vérifie que l’API fonctionne.'
          );
        }
      });
  }

  deleteEvent(event: HubEvent): void {
    if (this.deletingId() !== null || this.saving()) {
      return;
    }

    const confirmed = window.confirm(
      `Supprimer l’événement « ${event.title} » ?`
    );

    if (!confirmed) {
      return;
    }

    this.deletingId.set(event.id);
    this.actionError.set('');
    this.message.set('');

    this.eventService.remove(event.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletingId.set(null);

          this.favorites.update(ids =>
            ids.filter(id => id !== event.id)
          );

          if (this.editingId() === event.id) {
            this.closeForm();
          }

          this.message.set(
            'Événement supprimé avec succès.'
          );

        },
        error: () => {
          this.deletingId.set(null);

          this.actionError.set(
            'Suppression impossible. Réessaie.'
          );
        }
      });
  }
}
