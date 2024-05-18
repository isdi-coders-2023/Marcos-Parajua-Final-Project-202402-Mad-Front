import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Article } from '../entities/article.js';
import { environment } from '../environments/environment.dev';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RepoArticlesService {
  httpClient = inject(HttpClient);
  url = environment.apiUrl + '/articles';

  getById(id: string): Observable<Article> {
    return this.httpClient.get<Article>(`${this.url}/${id}`);
  }

  create(data: FormData) {
    const url = this.url;
    return this.httpClient.post(url, data);
  }

  getArticles() {
    return this.httpClient.get<Article[]>(this.url);
  }

  deleteArticle(id: string) {
    return this.httpClient.delete<Article>(this.url + '/' + id);
  }

  update(id: string, article: FormData): Observable<Article> {
    return this.httpClient.patch<Article>(`${this.url}/${id}`, article);
  }
}
