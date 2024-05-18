import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { State, StateService } from '../../services/state.service';
import ProfileComponent from './profile.component';
import { Article } from '../../entities/article';
import { User } from '../../entities/user';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let stateService: jasmine.SpyObj<StateService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const stateServiceMock = jasmine.createSpyObj('StateService', [
      'getState',
      'loadUserArticles',
      'loadArticles',
      'deleteArticle',
    ]);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    stateServiceMock.getState.and.returnValue(
      of({
        currentUser: {
          id: '1',
          name: 'Test User',
          avatar: 'test-avatar.jpg',
          articles: [
            {
              id: '1',
              title: 'Article 1',
              subtitle: 'Subtitle 1',
              avatar: 'avatar1.jpg',
              authorId: '1',
            },
            {
              id: '2',
              title: 'Article 2',
              subtitle: 'Subtitle 2',
              avatar: 'avatar2.jpg',
              authorId: '1',
            },
          ],
        },
      }),
    );

    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        { provide: StateService, useValue: stateServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    stateService = TestBed.inject(StateService) as jasmine.SpyObj<StateService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user profile data', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const userName = compiled.querySelector('.user-name').textContent;
    const userImage = compiled.querySelector('.user-profile-image').src;
    expect(userName).toContain('Test User');
    expect(userImage).toContain('test-avatar.jpg');
  });

  it('should display user articles', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const articles = compiled.querySelectorAll('.user-article-card');
    expect(articles.length).toBe(2);
    expect(
      articles[0].querySelector('.user-article-title').textContent,
    ).toContain('Article 1');
    expect(
      articles[1].querySelector('.user-article-title').textContent,
    ).toContain('Article 2');
  });

  it('should call delete method when delete button is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'delete').and.callThrough();
    const compiled = fixture.nativeElement;
    const deleteButton = compiled.querySelectorAll(
      '.user-article-buttons img',
    )[0];
    deleteButton.click();
    expect(component.delete).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: '1' }),
    );
    expect(stateService.deleteArticle).toHaveBeenCalledWith('1');
  });

  it('should call update method when update button is clicked', () => {
    fixture.detectChanges();
    spyOn(component, 'update').and.callThrough();
    const compiled = fixture.nativeElement;
    const updateButton = compiled.querySelectorAll(
      '.user-article-buttons img',
    )[1];
    updateButton.click();
    expect(component.update).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: '1' }),
    );
    expect(router.navigate).toHaveBeenCalledWith(['/update-article', '1']);
  });

  it('should load user articles on init if current user exists', () => {
    expect(stateService.loadUserArticles).toHaveBeenCalledWith('1');
  });

  it('should call loadArticles if articles are not an array', () => {
    stateService.getState.and.returnValue(
      of({
        currentUser: { id: '1', name: 'Test User', articles: null },
      } as unknown as State),
    );
    component.ngOnInit();
    expect(stateService.loadArticles).toHaveBeenCalled();
  });

  it('should call loadUserArticles in constructor if current user exists', () => {
    const mockCurrentUser = { id: '1', name: 'Test User' } as User;
    spyOnProperty(stateService, 'currentUser').and.returnValue(mockCurrentUser);

    expect(stateService.loadUserArticles).toHaveBeenCalledWith('1');
  });

  it('should return user articles filtered by current user id', () => {
    const articles: Article[] = [
      {
        id: '1',
        title: 'Title 1',
        subtitle: 'Subtitle 1',
        avatar: 'Avatar 1',
        authorId: '1',
      } as Article,
      {
        id: '2',
        title: 'Title 2',
        subtitle: 'Subtitle 2',
        avatar: 'Avatar 2',
        authorId: '2',
      } as Article,
    ];
    const mockCurrentUser = { id: '1', name: 'Test User' } as User;
    spyOnProperty(stateService, 'currentUser').and.returnValue(mockCurrentUser);
    const filteredArticles = component.userArticles(articles);
    expect(filteredArticles.length).toBe(1);
    expect(filteredArticles[0].authorId).toBe('1');
  });

  it('should return an empty array if there is no current user', () => {
    const articles: Article[] = [
      {
        id: '1',
        title: 'Title 1',
        subtitle: 'Subtitle 1',
        avatar: 'Avatar 1',
        authorId: '1',
      } as Article,
      {
        id: '2',
        title: 'Title 2',
        subtitle: 'Subtitle 2',
        avatar: 'Avatar 2',
        authorId: '2',
      } as Article,
    ];
    const filteredArticles = component.userArticles(articles);
    expect(filteredArticles.length).toBe(0);
  });
});
