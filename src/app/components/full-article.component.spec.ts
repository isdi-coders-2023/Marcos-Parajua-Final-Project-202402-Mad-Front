/* eslint-disable @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { State, StateService } from '../../services/state.service';
import { RepoArticlesService } from '../../services/articles.repo';
import FullArticleComponent from './full-article.component';
import { Article } from '../../entities/article';
import { ChangeDetectorRef } from '@angular/core';

describe('FullArticleComponent', () => {
 let component: FullArticleComponent;
 let fixture: ComponentFixture<FullArticleComponent>;
 let stateService: jasmine.SpyObj<StateService>;
 let repoService: jasmine.SpyObj<RepoArticlesService>;
 let router: jasmine.SpyObj<Router>;
 let route: jasmine.SpyObj<ActivatedRoute>;
 let cdr: jasmine.SpyObj<ChangeDetectorRef>;

 beforeEach(async () => {
  const stateServiceMock = jasmine.createSpyObj('StateService', [
   'getState',
   'deleteArticle',
  ]);
  const repoServiceMock = jasmine.createSpyObj('RepoArticlesService', [
   'getById',
  ]);
  const routerMock = jasmine.createSpyObj('Router', ['navigate']);
  const routeMock = {
   snapshot: {
    paramMap: {
     get: jasmine.createSpy('get').and.returnValue('1'),
    },
   },
  };
  const cdrMock = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

  stateServiceMock.getState.and.returnValue(
   of({
    currentUser: { name: 'Test User' },
   }),
  );

  repoServiceMock.getById.and.returnValue(
   of({
    id: '1',
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    content: 'Test Content',
    avatar: 'test-avatar.jpg',
    maker: 'Test User',
    createdAt: new Date(),
   }),
  );

  await TestBed.configureTestingModule({
   imports: [FullArticleComponent],
   providers: [
    { provide: StateService, useValue: stateServiceMock },
    { provide: RepoArticlesService, useValue: repoServiceMock },
    { provide: Router, useValue: routerMock },
    { provide: ActivatedRoute, useValue: routeMock },
    { provide: ChangeDetectorRef, useValue: cdrMock },
   ],
  }).compileComponents();

  fixture = TestBed.createComponent(FullArticleComponent);
  component = fixture.componentInstance;
  stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
  repoService = TestBed.inject(
   RepoArticlesService,
  ) as jasmine.SpyObj<RepoArticlesService>;
  router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  route = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
  cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

  fixture.detectChanges();
 });

 it('should create', () => {
  expect(component).toBeTruthy();
 });

 it('should initialize and fetch article by id', () => {
  expect(repoService.getById).toHaveBeenCalledWith('1');
  expect(component.item).toEqual({
   id: '1',
   title: 'Test Title',
   subtitle: 'Test Subtitle',
   content: 'Test Content',
   avatar: 'test-avatar.jpg',
   maker: 'Test User',
   createdAt: jasmine.any(Date),
  } as unknown as Article);
 });

 xit('should handle error when fetching article by id fails', () => {
  repoService.getById.and.returnValue(
   throwError(() => new Error('Error fetching article')),
  );
  component.ngOnInit();
  fixture.detectChanges();
  expect(component.item).toBeUndefined();
 });

 it('should display delete and update buttons if current user is the maker', () => {
  component.item = {
   id: '1',
   title: 'Test Title',
   subtitle: 'Test Subtitle',
   content: 'Test Content',
   avatar: 'test-avatar.jpg',
   maker: 'Test User',
   createdAt: '2021-01-01',
  } as Article;
  fixture.detectChanges();
  const compiled = fixture.nativeElement;
  expect(compiled.querySelectorAll('.articles-buttons img').length).toBe(2);
 });

 it('should not display delete and update buttons if current user is not the maker', () => {
  stateService.getState.and.returnValue(
   of({
    currentUser: { name: 'Other User' },
   } as State),
  );
  component.ngOnInit();
  component.item = {
   id: '1',
   title: 'Test Title',
   subtitle: 'Test Subtitle',
   content: 'Test Content',
   avatar: 'test-avatar.jpg',
   maker: 'Test User',
   createdAt: '2021-01-01',
  } as Article;
  fixture.detectChanges();
  const compiled = fixture.nativeElement;
  expect(compiled.querySelectorAll('.articles-buttons img').length).toBe(0);
 });

 it('should call delete method and delete the article', () => {
  component.item = {
   id: '1',
   title: 'Test Title',
   subtitle: 'Test Subtitle',
   content: 'Test Content',
   avatar: 'test-avatar.jpg',
   maker: 'Test User',
   createdAt: '2021-01-01',
  } as Article;
  fixture.detectChanges();
  component.delete(component.item);
  expect(stateService.deleteArticle).toHaveBeenCalledWith('1');
 });

 it('should navigate to update article page on update', () => {
  component.item = {
   id: '1',
   title: 'Test Title',
   subtitle: 'Test Subtitle',
   content: 'Test Content',
   avatar: 'test-avatar.jpg',
   maker: 'Test User',
   createdAt: '2021-01-01',
  } as Article;
  fixture.detectChanges();
  component.update(component.item);
  expect(router.navigate).toHaveBeenCalledWith(['/update-article', '1']);
 });
});
