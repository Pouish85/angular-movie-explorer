import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private _searchQuery = new BehaviorSubject<string>('');
  public readonly searchQuery$: Observable<string> =
    this._searchQuery.asObservable();

  constructor() {}

  setSearchQuery(query: string): void {
    this._searchQuery.next(query);
  }

  getCurrentSearchQuery(): string {
    return this._searchQuery.value;
  }
}
