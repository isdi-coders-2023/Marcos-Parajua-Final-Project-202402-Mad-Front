import { Component, OnInit, inject } from '@angular/core';
import { State, StateService } from '../../services/state.service';
import { AsyncPipe } from '@angular/common';
import { User } from '../../entities/user';
import { Subscription } from 'rxjs';
import createArticleComponent from './create-article.component';
import ArticlesListComponent from './articles-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, createArticleComponent, ArticlesListComponent],
  template: `
    <div class="home-body">
      @switch (state.loginState) {
        @case ('idle') {
          <app-articles-list [layoutType]="'block-layout'"></app-articles-list>
        }
        @case ('logged') {
          <app-articles-list [layoutType]="'block-layout'"></app-articles-list>
        }
        @case ('error') {
          <p>Failed to Access</p>
        }
      }
    </div>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      justify-content: start;

      width: 100vw;
      height: 85vh;
      padding-inline: 20px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .home-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-content: center;
      max-width: 100vw;
      gap: 20px;
    }
    img {
      width: 200px;
    }
    .user-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }
  `,
})
export default class HomeComponent implements OnInit {
  currentUser!: User;
  subscription!: Subscription;
  stateService = inject(StateService);
  state!: State;

  ngOnInit() {
    this.stateService.getState().subscribe((state) => {
      this.currentUser = state.currentUser as User;
      this.state = state;
    });
  }
}
