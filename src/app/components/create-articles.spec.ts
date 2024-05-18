import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { StateService } from '../../services/state.service';
import { RepoArticlesService } from '../../services/articles.repo';
import createArticleComponent from './create-article.component';
import { User } from '../../entities/user';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

describe('createArticleComponent', () => {
  let component: createArticleComponent;
  let fixture: ComponentFixture<createArticleComponent>;
  let stateService: jasmine.SpyObj<StateService>;
  let repoService: jasmine.SpyObj<RepoArticlesService>;
  let router: jasmine.SpyObj<Router>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const stateServiceMock = jasmine.createSpyObj('StateService', ['getState']);
    const repoServiceMock = jasmine.createSpyObj('RepoArticlesService', [
      'create',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const cdrMock = jasmine.createSpyObj('ChangeDetectorRef', [
      'detectChanges',
    ]);

    stateServiceMock.getState.and.returnValue(
      of({
        currentUser: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          avatar: 'avatar.jpg',
          articles: [],
        },
      }),
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, createArticleComponent],
      providers: [
        { provide: StateService, useValue: stateServiceMock },
        { provide: RepoArticlesService, useValue: repoServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(createArticleComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
    repoService = TestBed.inject(
      RepoArticlesService,
    ) as jasmine.SpyObj<RepoArticlesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    cdr = TestBed.inject(
      ChangeDetectorRef,
    ) as jasmine.SpyObj<ChangeDetectorRef>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with state from StateService', () => {
    expect(stateService.getState).toHaveBeenCalled();
    expect(component.currentUser).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      avatar: 'avatar.jpg',
      articles: [],
    } as User);
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
    component.form.setValue({
      title: 'Test Title',
      subtitle: 'Test Subtitle',
      content: 'Test Content',
      avatar: 'test-avatar.jpg',
    });

    repoService.create.and.returnValue(of({}));

    component.submit();

    expect(repoService.create).toHaveBeenCalledWith(jasmine.any(FormData));
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

  it('should enable submit button if form is valid', () => {
    component.form.setValue({
      title: 'Test Title',
      subtitle: '',
      content: 'Test Content',
      avatar: null,
    });
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector(
      '.article-create-button',
    );
    expect(submitButton.disabled).toBeFalsy();
  });
});
