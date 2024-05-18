import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { StateService, Payload } from './state.service';
import { RepoUsersService } from './users.repo';
import { RepoArticlesService } from './articles.repo';
import { User } from '../entities/user';
import { Article } from '../entities/article';

describe('StateService', () => {
  let service: StateService;
  let mockRepoUsersService: jasmine.SpyObj<RepoUsersService>;
  let mockRepoArticlesService: jasmine.SpyObj<RepoArticlesService>;
  let jwtDecodeSpy: jasmine.Spy;

  beforeEach(() => {
    const repoUsersSpy = jasmine.createSpyObj('RepoUsersService', [
      'getById',
      'getUsers',
      'getUserArticles',
    ]);
    const repoArticlesSpy = jasmine.createSpyObj('RepoArticlesService', [
      'getArticles',
      'deleteArticle',
    ]);

    TestBed.configureTestingModule({
      providers: [
        StateService,
        { provide: RepoUsersService, useValue: repoUsersSpy },
        { provide: RepoArticlesService, useValue: repoArticlesSpy },
      ],
    });

    service = TestBed.inject(StateService);
    mockRepoUsersService = TestBed.inject(
      RepoUsersService,
    ) as jasmine.SpyObj<RepoUsersService>;
    mockRepoArticlesService = TestBed.inject(
      RepoArticlesService,
    ) as jasmine.SpyObj<RepoArticlesService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable of state', () => {
    expect(service.getState()).toBeInstanceOf(Observable);
  });

  it('should return the current state', () => {
    const state = service['state$'].value;
    expect(service.state).toEqual(state);
  });

  it('should return the current user', () => {
    expect(service.currentUser).toEqual(service.state.currentUser);
  });

  it('should set login state', () => {
    service.setLoginState('logged');
    expect(service.state.loginState).toBe('logged');
  });

  it('should set login', () => {
    const token = 'dummyToken';
    const currentPayload: Payload = {
      id: '1',
      role: 'admin',
      exp: 1234567890,
    };
    const user: User = {
      id: '1',
      name: 'John Doe',
      email: 'sample@sample.com',
      avatar: 'avatar.jpg',
      articles: [],
    };

    jwtDecodeSpy.and.returnValue(currentPayload);
    mockRepoUsersService.getById.and.returnValue(of(user));

    service.setLogin(token);

    expect(service.state.loginState).toBe('logged');
    expect(service.state.token).toBe(token);
    expect(service.state.currentPayload).toEqual(currentPayload);
    expect(service.state.currentUser).toEqual(user);
  });

  it('should set logout', () => {
    service.setLogout();
    expect(service.state.loginState).toBe('idle');
    expect(service.state.token).toBeNull();
    expect(service.state.currentPayload).toBeNull();
    expect(service.state.currentUser).toBeNull();
  });

  it('should set isLoading to false when calling loaderHide()', () => {
    service.loaderHide();
    expect(service.isLoading()).toBe(false);
  });

  it('should set isLoading to true when calling loaderShow()', () => {
    service.loaderShow();
    expect(service.isLoading()).toBe(true);
  });

  it('should load users from RepoUsersService', () => {
    const users: User[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'sample@sample.com',
        avatar: 'avatar.jpg',
        articles: [],
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'simple@simple.com',
        avatar: 'avatar.jpg',
        articles: [],
      },
    ];

    mockRepoUsersService.getUsers.and.returnValue(of(users));

    service.loadUsers();

    expect(service.state.users).toEqual(users);
  });

  it('should load articles from RepoArticlesService', () => {
    const mockUser: Partial<User> = {};
    const articles: Article[] = [
      {
        id: '1',
        title: 'Article 1',
        content: 'Content 1',
        author: mockUser,
        authorId: '1',
        maker: '1',
      },
      {
        id: '2',
        title: 'Article 2',
        content: 'Content 2',
        author: mockUser,
        authorId: '2',
        maker: '2',
      },
    ];

    mockRepoArticlesService.getArticles.and.returnValue(of(articles));

    service.loadArticles();

    expect(service.state.articles).toEqual(articles);
  });

  it('should load user articles from RepoUsersService', () => {
    const mockUser: Partial<User> = {};
    const userId = '1';
    const articles: Article[] = [
      {
        id: '1',
        title: 'Article 1',
        content: 'Content 1',
        author: mockUser,
        authorId: '1',
        maker: '1',
      },
      {
        id: '2',
        title: 'Article 2',
        content: 'Content 2',
        author: mockUser,
        authorId: '1',
        maker: '1',
      },
    ];

    mockRepoUsersService.getUserArticles.and.returnValue(of(articles));

    service.loadUserArticles(userId);

    expect(service.state.articles).toEqual(articles);
  });

  it('should delete an article and reload articles', () => {
    const mockUser = {} as Article;
    const articleId = '1';
    spyOn(service, 'loadArticles');
    mockRepoArticlesService.deleteArticle.and.returnValue(of(mockUser));

    service.deleteArticle(articleId);

    expect(mockRepoArticlesService.deleteArticle).toHaveBeenCalledWith(
      articleId,
    );
    expect(service.loadArticles).toHaveBeenCalled();
  });
});
