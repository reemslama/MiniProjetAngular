import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Favorites {
  readonly ids = signal<number[]>([]);
}