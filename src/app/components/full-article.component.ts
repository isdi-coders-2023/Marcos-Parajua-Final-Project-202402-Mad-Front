import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from '../../entities/article';
import { StateService } from '../../services/state.service';
import { RepoArticlesService } from '../../services/articles.repo';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-full-article',
  standalone: true,
  imports: [AsyncPipe, DatePipe],
  template: `
    @if (item) {
      <div class="articles-container">
        @if (stateService.getState() | async; as state) {
          @if (state.currentUser?.name === item.maker) {
            <div class="articles-buttons">
              <img
                src="./assets/delete.svg"
                alt="delete button"
                (click)="delete(item)"
                (keyup)="delete(item)"
                tabindex="0"
              />
              <img
                src="./assets/update.svg"
                alt="update button"
                (click)="update(item)"
                (keyup)="update(item)"
                tabindex="0"
              />
            </div>
          }
          <div class="articles-card">
            <h2 class="articles-title">{{ item.title }}</h2>
            <p class="articles-author">{{ item.maker }}</p>

            <img
              src="{{ item.avatar }}"
              alt="article illustration"
              class="articles-avatar"
            />
            <p class="articles-date">{{ item.createdAt | date }}</p>
            <p class="articles-subtitle">{{ item.subtitle }}</p>
            <p class="articles-content">{{ item.content }}</p>
          </div>
        }
      </div>
    }
  `,
  styles: `
    :host {
      overflow: hidden;
      padding: 20px;
    }

    .articles-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      gap: 20px;
      padding: 20px;
      padding-block: 100px;
    }
    .articles-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      width: 100%;
    }
    .articles-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      width: 100%;
    }

    .articles-title {
      font-size: 24px;
      font-weight: bold;
    }
    .articles-author {
      font-size: 18px;
    }
    .articles-avatar {
      width: 100%;
      height: 300px;
      object-fit: cover;
    }
  `,
})
export default class FullArticleComponent implements OnInit {
  stateService = inject(StateService);
  private repo = inject(RepoArticlesService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private subscription: Subscription = new Subscription();

  @Input() item!: Article;

  ngOnInit() {
    const articleId = this.route.snapshot.paramMap.get('id');
    if (articleId) {
      this.subscription.add(
        this.repo.getById(articleId).subscribe({
          next: (article) => {
            this.item = article;
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error fetching article:', err);
          },
        }),
      );
    }
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
