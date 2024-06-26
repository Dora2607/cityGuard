import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  private _show = new Subject<void>();
  show$ = this._show.asObservable();

  private _searchTerm = new BehaviorSubject<string>('');

  get searchTerm(): Observable<string> {
    return this._searchTerm.asObservable();
  }

  show() {
    this._show.next();
  }

  search(term: string) {
    this._searchTerm.next(term.toLowerCase());
  }
}
