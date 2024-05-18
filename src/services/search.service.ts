import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchToggleSubject = new BehaviorSubject<boolean>(false);
  searchToggle$ = this.searchToggleSubject.asObservable();

  toggleSearch() {
    this.searchToggleSubject.next(!this.searchToggleSubject.value);
  }
}
