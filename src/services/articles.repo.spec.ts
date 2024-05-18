import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RepoArticlesService } from './articles.repo';
import { environment } from '../environments/environment.dev';
import { Article } from '../entities/article.js';
import { User } from '../entities/user';

describe('RepoArticlesService', () => {
  let service: RepoArticlesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RepoArticlesService],
    });

    service = TestBed.inject(RepoArticlesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getById API', () => {
    const mockUser = {} as Partial<User>;
    const dummyArticle: Article = {
      id: '1',
      title: 'Article 1',
      content: 'Content 1',
      authorId: '1',
      maker: '1',
      avatar: 'avatar.jpg',
      subtitle: 'Subtitle 1',
      author: mockUser,
    };

    service.getById('1').subscribe((article) => {
      expect(article).toEqual(dummyArticle);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/articles/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyArticle);
  });

  it('should call create API', () => {
    const mockUser = {} as Partial<User>;
    const formData = new FormData();
    const dummyArticle: Article = {
      id: '1',
      title: 'New Article',
      content: 'New Content',
      authorId: '1',
      maker: '1',
      avatar: 'avatar.jpg',
      subtitle: 'Subtitle 1',
      author: mockUser,
    };

    service.create(formData).subscribe((response) => {
      expect(response).toEqual(dummyArticle);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/articles');
    expect(req.request.method).toBe('POST');
    req.flush(dummyArticle);
  });

  it('should call getArticles API', () => {
    const mockUser = {} as Partial<User>;
    const dummyArticles: Article[] = [
      {
        id: '1',
        title: 'Article 1',
        content: 'Content 1',
        authorId: '1',
        maker: '1',
        avatar: 'avatar.jpg',
        subtitle: 'Subtitle 1',
        author: mockUser,
      },
      {
        id: '2',
        title: 'Article 2',
        content: 'Content 2',
        authorId: '2',
        maker: '2',
        avatar: 'avatar.jpg',
        subtitle: 'Subtitle 2',
        author: mockUser,
      },
    ];

    service.getArticles().subscribe((articles) => {
      expect(articles.length).toBe(2);
      expect(articles).toEqual(dummyArticles);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/articles');
    expect(req.request.method).toBe('GET');
    req.flush(dummyArticles);
  });

  it('should call deleteArticle API', () => {
    const mockUser = {} as Partial<User>;
    const dummyArticle: Article = {
      id: '1',
      title: 'Article 1',
      content: 'Content 1',
      authorId: '1',
      maker: '1',
      avatar: 'avatar.jpg',
      subtitle: 'Subtitle 1',
      author: mockUser,
    };

    service.deleteArticle('1').subscribe((response) => {
      expect(response).toEqual(dummyArticle);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/articles/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(dummyArticle);
  });

  it('should call update API', () => {
    const mockUser = {} as Partial<User>;
    const formData = new FormData();
    const dummyArticle: Article = {
      id: '1',
      title: 'Updated Article',
      content: 'Updated Content',
      authorId: '1',
      maker: '1',
      avatar: 'avatar.jpg',
      subtitle: 'Subtitle 1',
      author: mockUser,
    };

    service.update('1', formData).subscribe((article) => {
      expect(article).toEqual(dummyArticle);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/articles/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush(dummyArticle);
  });
});
