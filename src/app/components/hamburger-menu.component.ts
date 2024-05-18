import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { State, StateService } from '../../services/state.service';

@Component({
  selector: 'app-hamburger-menu',
  standalone: true,
  imports: [],
  template: `
    @if (isShowHamburger === true) {
      <nav class="hamburger-menu-container">
        <p
          class="hamburger-menu-option"
          (click)="onClickArticles()"
          (keyup)="onClickArticles()"
          tabindex="0"
        >
          Journal
        </p>
        @if (state.loginState === 'logged') {
          <p
            class="hamburger-menu-option"
            (click)="onClickCreateArticle()"
            (keyup)="onClickCreateArticle()"
            tabindex="0"
          >
            Write New Article
          </p>
        }
      </nav>
    }
  `,
  styles: `
    :host {
      position: absolute;
    }
    .hamburger-menu-option {
      background-color: #1c1a1c;
      color: white;
      border: white 1px solid;
      width: 100vw;
      text-align: center;
      padding: 10px;
    }
    .hamburger-menu-option:hover {
      background-color: #2c2a2c;
    }
    .hamburger-menu-option:focus {
      background-color: #2c2a2c;
    }
  `,
})
export class HamburgerMenuComponent implements OnInit {
  stateService = inject(StateService);
  state!: State;
  @Input() isShowHamburger = false;
  router = inject(Router);

  ngOnInit() {
    this.stateService.getState().subscribe((state) => {
      this.state = state;
    });
  }
  onClickArticles() {
    this.router.navigate(['articles']);
    this.isShowHamburger = false;
  }

  onClickCreateArticle() {
    this.router.navigate(['create-article']);
    this.isShowHamburger = false;
  }
}
