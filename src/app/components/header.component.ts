import { AsyncPipe } from '@angular/common';
import { StateService } from '../../services/state.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UsersMenuComponent } from './users-menu.component';
import { HamburgerMenuComponent } from './hamburger-menu.component';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <nav class="header-routes">
        <img
          src="./assets/hamburger.svg"
          alt=" Hamburger menu"
          width="20px"
          height="20px"
          (click)="toggleHamburgerMenu()"
          (keyup)="toggleHamburgerMenu()"
          tabindex="0"
        />
        <img
          src="./assets/login.svg"
          alt="Users icon"
          width="20px"
          height="20px"
          (click)="toggleUsersMenu()"
          (keyup)="toggleUsersMenu()"
          tabindex="0"
        />

        <img
          src="./assets/search.svg"
          alt="Search"
          width="20px"
          height="20px"
          (click)="toggleSearch()"
          (keyup)="toggleSearch()"
          tabindex="0"
        />
      </nav>

      <div class="header-logo">
        <h1>Hyphae</h1>
        <img
          src="./assets/hyphae-logo.svg"
          alt="Hyphae logo"
          width="27px"
          height="27px"
          (click)="onClickHome()"
          (keyup)="onClickHome()"
          tabindex="0"
        />
      </div>
    </header>
    @if (isShow === true) {
      <app-users-menu [isShow]="isShow"></app-users-menu>
    }

    @if (isShowHamburger === true) {
      <app-hamburger-menu
        [isShowHamburger]="isShowHamburger"
      ></app-hamburger-menu>
    }
  `,
  styles: `
    .header {
      height: 8vh;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      background-color: #1c1a1c;
      color: white;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.26);
    }
    .header-logo {
      display: flex;
      gap: 0.8rem;
      width: 100vw;
      padding-block: 1rem;
      justify-content: flex-end;
      align-items: center;
      font-size: 10px;
      font-weight: bold;
    }

    .header-routes {
      display: flex;
      gap: 2.5rem;
      width: 100vw;
      padding-block: 1rem;
      justify-content: flex-start;
      align-items: center;
    }
    .header-logout__container {
      display: flex;
      width: 55px;
      flex-wrap: nowrap;
    }
    .header-logout {
      cursor: pointer;
      font-size: 15px;
    }
  `,
  imports: [AsyncPipe, UsersMenuComponent, HamburgerMenuComponent],
})
export class HeaderComponent {
  searchService = inject(SearchService);
  isShow = false;
  isShowHamburger = false;

  stateService = inject(StateService);
  router = inject(Router);

  onClickHome() {
    this.router.navigate(['home']);
  }

  onClickLogin() {
    this.router.navigate(['login']);
  }
  onClickLogout() {
    localStorage.removeItem('books');
    this.stateService.setLogout();
  }

  toggleUsersMenu() {
    this.isShow = !this.isShow;
  }

  toggleHamburgerMenu() {
    this.isShowHamburger = !this.isShowHamburger;
  }

  toggleSearch() {
    this.searchService.toggleSearch();
  }
}
