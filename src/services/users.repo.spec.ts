import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RepoUsersService } from './users.repo';
import { environment } from '../environments/environment.dev';
import { Article } from '../entities/article.js';
import { User } from '../entities/user';

describe('RepoUsersService', () => {
  let service: RepoUsersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepoUsersService],
    });

    service = TestBed.inject(RepoUsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login API', () => {
    const dummyData = { token: 'token' };
    const mockData = { username: 'user', password: 'password' };

    service.login(mockData).subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/users/login');
    expect(req.request.method).toBe('POST');
    req.flush(dummyData);
  });

  it('should call getById API', () => {
    const dummyData = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'avatar.jpg',
    };
    const userId = '1';

    service.getById(userId).subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/users/' + userId);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should call create API', () => {
    const dummyData = {};
    const formData = new FormData();

    service.create(formData).subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/users/signup');
    expect(req.request.method).toBe('POST');
    req.flush(dummyData);
  });

  it('should call getUsers API', () => {
    const dummyData = [
      {
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
        avatar: 'avatar1.jpg',
        articles: [],
      },
      {
        id: '2',
        name: 'User 2',
        email: 'user2@example.com',
        avatar: 'avatar2.jpg',
        articles: [],
      },
    ];

    service.getUsers().subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/users');
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });

  it('should call getUserArticles API', () => {
    const mockUser: Partial<User> = {};
    const dummyData: Article[] = [
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
    const userId = '1';

    service.getUserArticles(userId).subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/users/' + userId);
    expect(req.request.method).toBe('GET');
    req.flush(dummyData);
  });
});
