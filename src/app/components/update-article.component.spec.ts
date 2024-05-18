import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RepoArticlesService } from '../../services/articles.repo';
import { StateService } from '../../services/state.service';
import { User } from '../../entities/user';
import UpdateArticleComponent from './update-article.component';
import { Article } from '../../entities/article';
import { ElementRef } from '@angular/core';

describe('UpdateArticleComponent', () => {
  let component: UpdateArticleComponent;
  let fixture: ComponentFixture<UpdateArticleComponent>;

  let repoService: jasmine.SpyObj<RepoArticlesService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const stateServiceMock = jasmine.createSpyObj('StateService', ['getState']);
    const repoServiceMock = jasmine.createSpyObj('RepoArticlesService', [
      'update',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const routeMock = {
      snapshot: { params: { id: '1' } },
    } as unknown as ActivatedRoute;

    stateServiceMock.getState.and.returnValue(
      of({
        currentUser: { id: '1', name: 'Test User' } as User,
        articles: [
          {
            id: '1',
            title: 'Test Title',
            subtitle: 'Test Subtitle',
            content: 'Test Content',
            avatar: 'test-avatar.jpg',
          },
        ],
      }),
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UpdateArticleComponent],
      providers: [
        { provide: StateService, useValue: stateServiceMock },
        { provide: RepoArticlesService, useValue: repoServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: routeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateArticleComponent);
    component = fixture.componentInstance;

    repoService = TestBed.inject(
      RepoArticlesService,
    ) as jasmine.SpyObj<RepoArticlesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with article data', () => {
    expect(component.form.value).toEqual({
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      content: 'Test Content',
      avatar: 'test-avatar.jpg',
    });
  });

  it('should handle file input change', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const event = { target: { files: [file] } };

    spyOn(component.form, 'patchValue');
    component.avatar = { nativeElement: event.target } as ElementRef;
    await component.onFileChange();

    expect(component.form.patchValue).toHaveBeenCalledWith({ avatar: file });
  });

  it('should submit form and navigate to articles', () => {
    const mockArticle = {} as Article;
    component.form.setValue({
      title: 'Updated Title',
      subtitle: 'Updated Subtitle',
      content: 'Updated Content',
      avatar: 'updated-avatar.jpg',
    });

    repoService.update.and.returnValue(of(mockArticle));

    component.submit();

    expect(repoService.update).toHaveBeenCalledWith('1', jasmine.any(FormData));
    expect(router.navigate).toHaveBeenCalledWith(['/articles']);
  });

  it('should disable submit button if form is invalid', () => {
    component.form.controls['title'].setValue('');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      '.article-create-button',
    );
    expect(submitButton.disabled).toBeTruthy();
  });
});
