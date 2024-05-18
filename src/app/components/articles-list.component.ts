import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { StateService } from '../../services/state.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Article } from '../../entities/article';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [AsyncPipe, NgClass, FormsModule],
  template: `
    <div class="articles-header__container">
      <h2 class="articles-header">Journal.</h2>
      @if (showSearch) {
        <input
          class="search-input"
          [(ngModel)]="searchQuery"
          (input)="filterArticles()"
          placeholder="Search articles..."
        />
      }
    </div>
    @if (filteredArticles.length > 0) {
      <div class="articles-container" [ngClass]="layoutType">
        @if (layoutType === 'block-layout') {
          <img
            src="./assets/arrow.svg"
            alt="articles-pagination"
            class="carousel-control prev"
            (click)="scrollLeft()"
            (keyup)="scrollLeft()"
            tabindex="0"
          />
          <div class="carousel" #carousel>
            @for (item of filteredArticles; track item.id) {
              <div class="articles-card">
                @if (stateService.currentUser?.name === item.maker) {
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
                } @else {
                  <div class="articles-buttons_hidden">
                    <img src="./assets/delete.svg" alt="hidden delete button" />
                  </div>
                }
                <img
                  src="{{ item.avatar }}"
                  alt="illustration for article"
                  class="articles-avatar"
                  (click)="onClickFullArticle(item)"
                  (keyup)="onClickFullArticle(item)"
                  tabindex="0"
                />
                <p class="articles-author">{{ item.maker }}</p>
                <p class="articles-title">{{ item.title }}</p>
                @if (item.subtitle) {
                  <p class="articles-subtitle">{{ item.subtitle }}</p>
                }
              </div>
            }
          </div>
          <img
            src="./assets/arrowRight.svg"
            alt="articles-pagination"
            class="carousel-control next"
            (click)="scrollRight()"
            (keyup)="scrollRight()"
            tabindex="0"
          />
        } @else {
          @for (item of filteredArticles; track item.id) {
            <div class="articles-card">
              @if (stateService.currentUser?.name === item.maker) {
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
              } @else {
                <div class="articles-buttons_hidden">
                  <img src="./assets/delete.svg" alt="hidden delete button" />
                </div>
              }
              <img
                src="{{ item.avatar }}"
                alt="illustration for article"
                class="articles-avatar"
                (click)="onClickFullArticle(item)"
                (keyup)="onClickFullArticle(item)"
                tabindex="0"
              />
              <p class="articles-author">{{ item.maker }}</p>
              <p class="articles-title">{{ item.title }}</p>
              @if (item.subtitle) {
                <p class="articles-subtitle">{{ item.subtitle }}</p>
              }
            </div>
          }
        }
      </div>
    } @else {
      <p>No articles found.</p>
    }
  `,
  styles: `
    .articles-container {
      display: flex;
      flex-direction: column;
      align-items: center;

      width: 100vw;

      padding: 25px 46px;
      gap: 28px;
      height: 85vh;
    }

    .articles-header__container {
      display: flex;
      padding: 20px;
      width: 100vw;
      justify-content: start;
      align-content: flex-start;
    }

    .articles-header {
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 24px;
      color: #1c1a1c;
      padding: 20px;
      margin-left: 10px;
    }

    .articles-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;

      padding: 1rem;

      width: 200px;
      box-sizing: border-box;
    }

    .articles-avatar {
      width: 200px;
      height: 200px;
      object-fit: cover;
    }

    .articles-title {
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 16px;
      color: #1c1a1c;
    }

    .articles-subtitle {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
      color: #1c1a1c;
    }

    .articles-author {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 14px;
      color: #1c1a1c;
    }

    .articles-buttons {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      gap: 10px;
      min-height: 20px;
    }

    .articles-buttons_hidden {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      min-height: 20px;
      visibility: hidden;
    }

    .block-layout {
      display: flex;
      flex-direction: row;
    }

    .column-layout {
      display: flex;
      flex-direction: column;
    }

    .carousel {
      display: flex;
      gap: 20px;
      transition: transform 0.5s ease-in-out;
      overflow-x: auto;
      scroll-behavior: smooth;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .carousel::-webkit-scrollbar {
      display: none;
    }

    .carousel-control {
      position: absolute;
      top: 45%;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 1;
      padding: 10px;
    }

    .prev {
      left: 0;
    }

    .next {
      right: 0;
    }

    .search-input {
      width: 300px;
      height: 30px;
      border-radius: 5px;
      border: 1px solid #1c1a1c;
      padding: 5px;
      margin-left: 10px;
      margin-top: 15px;
    }
  `,
})
export default class ArticlesListComponent implements OnInit {
  @Input() layoutType: 'block-layout' | 'column-layout' = 'column-layout';
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;
  stateService = inject(StateService);
  @Input() item!: Article;
  router = inject(Router);
  searchService = inject(SearchService);
  private subscription: Subscription = new Subscription();
  searchQuery: string = '';
  articles: Article[] = [];
  filteredArticles: Article[] = [];
  showSearch: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.stateService.loadArticles();
  }
  ngOnInit() {
    this.subscription.add(
      this.stateService.getState().subscribe((state) => {
        this.articles = state.articles;
        this.filteredArticles = this.articles;
        this.cdr.detectChanges();
      }),
    );
    this.subscription.add(
      this.searchService.searchToggle$.subscribe((showSearch) => {
        this.showSearch = showSearch;
        this.cdr.detectChanges();
      }),
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

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth',
    });
  }

  onClickFullArticle(item: Article) {
    this.router.navigate(['/full-article', item.id]);
  }

  filterArticles() {
    const query = this.searchQuery.toLowerCase();
    this.filteredArticles = this.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.maker.toLowerCase().includes(query) ||
        (article.subtitle && article.subtitle.toLowerCase().includes(query)),
    );
    this.cdr.detectChanges();
  }
}
