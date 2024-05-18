import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { State, StateService } from '../../services/state.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-users-menu',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if (isShow === true) {
      @switch (state.loginState) {
        @case ('idle') {
          <nav class="users-menu-container">
            <p
              class="users-menu-option"
              (click)="onClickSignUp()"
              (keyup)="onClickSignUp()"
              tabindex="0"
            >
              Sign Up
            </p>
            <p
              class="users-menu-option"
              (click)="onClickLogin()"
              (keyup)="onClickLogin()"
              tabindex="0"
            >
              Log In
            </p>
          </nav>
        }
        @case ('logged') {
          <nav class="users-menu-container">
            <p
              class="users-menu-option"
              (click)="onClickProfile()"
              (keyup)="onClickProfile()"
              tabindex="0"
            >
              Your Profile
            </p>
            <p
              class="users-menu-option"
              (click)="onClickLogout()"
              (keyup)="onClickLogout()"
              tabindex="0"
            >
              Log Out
            </p>
          </nav>
        }
      }
    }
  `,
  styles: `
    :host {
      position: absolute;
    }
    .users-menu-option {
      background-color: #1c1a1c;
      color: white;
      border: white 1px solid;
      width: 100vw;
      text-align: center;
      padding: 10px;
    }
    .users-menu-option:hover {
      background-color: #2c2a2c;
    }
    .users-menu-option:focus {
      background-color: #2c2a2c;
    }
  `,
})
export class UsersMenuComponent implements OnInit {
  @Input() isShow = false;
  stateService = inject(StateService);
  router = inject(Router);
  state!: State;

  constructor() {}

  ngOnInit() {
    this.stateService.getState().subscribe((state) => {
      this.state = state;
    });
  }

  onClickProfile() {
    if (this.state.currentUser) {
      this.router.navigate(['/profile', this.state.currentUser.id]);
      this.isShow = false;
    }
  }

  onClickSignUp() {
    this.router.navigate(['/sign-up']);
    this.isShow = false;
  }

  onClickLogin() {
    this.router.navigate(['/login']);
    this.isShow = false;
  }

  onClickLogout() {
    this.stateService.setLogout();
    this.stateService.setLoginState('idle');
    localStorage.removeItem('books');
    this.router.navigate(['/']);
    this.isShow = false;
  }
}
