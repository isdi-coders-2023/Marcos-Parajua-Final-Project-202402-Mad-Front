import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { User, UserLoginDto } from '../entities/user.js';
import { environment } from '../environments/environment.js';
import { Article } from '../entities/article.js';

@Injectable({
 providedIn: 'root',
})
export class RepoUsersService {
 httpClient = inject(HttpClient);
 url = environment.apiUrl + '/users';

 login(data: UserLoginDto) {
  return this.httpClient.post<{ token: string }>(this.url + '/login', data);
 }

 getById(id: string) {
  return this.httpClient.get(this.url + '/' + id);
 }

 create(data: FormData) {
  const url = this.url + '/signup';
  return this.httpClient.post(url, data);
 }

 getUsers() {
  return this.httpClient.get<User[]>(this.url);
 }
 getUserArticles(userId: string) {
  return this.httpClient.get<Article[]>(`${this.url}/${userId}`);
 }
}
