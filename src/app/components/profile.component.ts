import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from '../../entities/article';
import { StateService } from '../../services/state.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="user-container">
      @if (stateService.getState() | async; as state) {
        @if (state.currentUser) {
          <div class="user-profile">
            <img
              class="user-profile-image"
              src="{{ state.currentUser.avatar }}"
              alt="user profile picture"
              height="200px"
              width="200px"
            />
            <h2 class="user-name">{{ state.currentUser.name }}</h2>
          </div>
          @if (
            state.currentUser.articles && state.currentUser.articles.length
          ) {
            <h3 class="user-articles-header">Articles.</h3>
            @for (item of state.currentUser.articles; track $index) {
              <div class="user-article-buttons">
                <img
                  src="./assets/delete.svg"
                  alt="delete button"
                  (click)="delete(item!)"
                  (keyup)="delete(item!)"
                  tabindex="0"
                />
                <img
                  src="./assets/update.svg"
                  alt="update button"
                  (click)="update(item!)"
                  (keyup)="update(item!)"
                  tabindex="0"
                />
              </div>

              <div class="user-article-card">
                <img
                  class="user-article-image"
                  src="{{ item?.avatar }}"
                  alt="article illustration"
                />
                <p class="user-article-title">{{ item?.title }}</p>
                <p class="user-article-subtitle">{{ item?.subtitle }}</p>
              </div>
            }
          }
        }
      }
    </div>
  `,
  styles: `
    .user-container {
      padding: 30px;
      width: 100vw;
      display: flex;
      gap: 10px;
      flex-direction: column;
      align-items: center;
    }
    .user-article-image {
      width: 100vw;
      height: 300px;
      object-fit: cover;
      padding-inline: 20px;
      padding-block: 0;
    }

    .user-profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      border-bottom: 1px solid #1c1a1c;
      padding: 20px;
      align-self: center;
      width: 80vw;
    }

    .user-profile-image {
      object-fit: cover;
    }

    .user-article-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      align-content: center;
      width: 100vw;
      gap: 20px;

      padding: 50px;
    }

    .user-articles-header {
      align-self: flex-start;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
      color: #1c1a1c;
      padding: 20px;
    }

    .user-name {
      font-size: 23px;
      font-weight: 300;
    }

    .user-article-buttons {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      gap: 10px;
      min-height: 20px;
    }

    .user-article-title {
      font-size: 20px;
      font-weight: 500;
      padding: 20px;
    }

    .user-article-subtitle {
      font-size: 15px;
      font-weight: 300;
      padding: 20px;
      width: 90vw;
      align-self: center;
    }
  `,
})
export default class ProfileComponent implements OnInit {
  stateService = inject(StateService);
  @Input() item!: Article;
  router = inject(Router);
  cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private subscription: Subscription = new Subscription();
  constructor() {
    if (this.stateService.currentUser) {
      this.stateService.loadUserArticles(this.stateService.currentUser.id);
    }
  }
  ngOnInit() {
    this.subscription.add(
      this.stateService.getState().subscribe((state) => {
        if (!Array.isArray(state.articles)) {
          this.stateService.loadArticles();
        }
        this.cdr.detectChanges();
      }),
    );
  }
  userArticles(articles: Article[]): Article[] {
    if (!this.stateService.currentUser) {
      return [];
    }
    return articles.filter(
      (article) => article.authorId === this.stateService.currentUser?.id,
    );
  }
  delete(item: Article) {
    if (item && item.id) {
      this.stateService.deleteArticle(item.id);
    }
  }
  update(item: Article) {
    this.router.navigate(['/update-article', item.id]);
  }
}
