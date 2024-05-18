import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header.component';
import { StateService } from '../services/state.service';
import LoaderComponent from './components/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-header></app-header>
    <app-loader></app-loader>
    <router-outlet />
  `,
  styles: ``,
  imports: [RouterOutlet, HeaderComponent, LoaderComponent],
})
export class AppComponent {
  stateService = inject(StateService);
  constructor() {
    const stringToken = localStorage.getItem('books');
    if (stringToken) {
      const { token } = JSON.parse(stringToken);
      this.stateService.setLogin(token);
    }
  }
}
