/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { of, Subject } from 'rxjs';
import { StateService } from '../../services/state.service';
import { SearchService } from '../../services/search.service';
import ArticlesListComponent from './articles-list.component';
import { Article } from '../../entities/article';

describe('ArticlesListComponent', () => {
  let component: ArticlesListComponent;
  let fixture: ComponentFixture<ArticlesListComponent>;
  let stateService: jasmine.SpyObj<StateService>;
  let router: jasmine.SpyObj<Router>;
  let searchService: jasmine.SpyObj<SearchService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const stateServiceMock = jasmine.createSpyObj('StateService', [
      'getState',
      'loadArticles',
      'deleteArticle',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const searchServiceMock = jasmine.createSpyObj('SearchService', [], {
      searchToggle$: new Subject<boolean>(),
    });
    const cdrMock = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);

    stateServiceMock.getState.and.returnValue(
      of({
        articles: [
          {
            id: '1',
            title: 'Test Article 1',
            subtitle: 'Test Subtitle 1',
            content: 'Test Content 1',
            avatar: 'test-avatar1.jpg',
            maker: 'Test Maker 1',
          },
          {
            id: '2',
            title: 'Test Article 2',
            subtitle: 'Test Subtitle 2',
            content: 'Test Content 2',
            avatar: 'test-avatar2.jpg',
            maker: 'Test Maker 2',
          },
        ],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [ArticlesListComponent],
      providers: [
        { provide: StateService, useValue: stateServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: SearchService, useValue: searchServiceMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesListComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    searchService = TestBed.inject(
      SearchService,
    ) as jasmine.SpyObj<SearchService>;
    cdr = TestBed.inject(
      ChangeDetectorRef,
    ) as jasmine.SpyObj<ChangeDetectorRef>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load articles from StateService', () => {
    expect(stateService.getState).toHaveBeenCalled();
    expect(component.articles.length).toBe(2);
    expect(component.filteredArticles.length).toBe(2);
  });

  it('should delete article', () => {
    component.delete(component.articles[0]);
    expect(stateService.deleteArticle).toHaveBeenCalledWith('1');
  });

  it('should navigate to update article page', () => {
    component.update(component.articles[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/update-article', '1']);
  });

  it('should navigate to full article page', () => {
    component.onClickFullArticle(component.articles[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/full-article', '1']);
  });

  it('should filter articles based on search query', () => {
    component.searchQuery = 'Maker 1';
    component.filterArticles();
    expect(component.filteredArticles.length).toBe(1);
    expect(component.filteredArticles[0].maker).toBe('Test Maker 1');
  });

  it('should show all articles when search query is empty', () => {
    component.searchQuery = '';
    component.filterArticles();
    expect(component.filteredArticles.length).toBe(2);
  });

  it('should handle search toggle', () => {
    (searchService.searchToggle$ as Subject<boolean>).next(true);
    expect(component.showSearch).toBeTrue();

    (searchService.searchToggle$ as Subject<boolean>).next(false);
    expect(component.showSearch).toBeFalse();
  });

  it('should scroll left in carousel', () => {
    const carouselMock = jasmine.createSpyObj('HTMLDivElement', ['scrollBy']);
    component.carousel = {
      nativeElement: carouselMock,
    } as ElementRef<HTMLDivElement>;
    component.scrollLeft();
    expect(carouselMock.scrollBy).toHaveBeenCalledWith({
      left: -200,
      behavior: 'smooth',
    });
  });

  it('should scroll right in carousel', () => {
    const carouselMock = jasmine.createSpyObj('HTMLDivElement', ['scrollBy']);
    component.carousel = {
      nativeElement: carouselMock,
    } as ElementRef<HTMLDivElement>;
    component.scrollRight();
    expect(carouselMock.scrollBy).toHaveBeenCalledWith({
      left: 200,
      behavior: 'smooth',
    });
  });
});
