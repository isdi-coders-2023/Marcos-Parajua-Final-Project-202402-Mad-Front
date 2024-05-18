import { Component, inject } from '@angular/core';

import { StateService } from '../../services/state.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-users-card',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="users-container">
      @if (stateService.getState() | async; as state) {
        @for (item of state.users; track $index) {
          <div class="users-card">
            <img
              src="{{ item.avatar }}"
              alt="user avatar"
              class="users-avatar"
            />
            <p class="users-name">{{ item.name }}</p>
          </div>
        }
      }
    </div>
  `,
  styles: `
    .users-container {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      justify-content: center;
    }

    .users-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 0.5rem;
      width: 200px;
    }

    .users-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  `,
})
export default class UsersCardComponent {
  stateService = inject(StateService);

  constructor() {
    this.stateService.loadUsers();
  }
}
