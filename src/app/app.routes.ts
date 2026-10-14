import { Routes } from '@angular/router';

import { EventList } from './event-list/event-list';
import { EventDetails } from './event-details/event-details';
import { NotFound } from './not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full'
  },
  {
    path: 'events',
    component: EventList
  },
  {
    path: 'events/:id',
    component: EventDetails
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./about/about').then(component => component.About)
  },
  {
    path: '**',
    component: NotFound
  }
];