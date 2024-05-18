import { BehaviorSubject, Observable } from 'rxjs';
import { RepoUsersService } from './users.repo';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { Injectable, inject, signal } from '@angular/core';
import { User } from '../entities/user';
import { RepoArticlesService } from './articles.repo';
import { Article } from '../entities/article';

type LoginState = 'idle' | 'logging' | 'logged' | 'error';

export type Payload = {
  id: string;
  role: string;
} & JwtPayload;

export type State = {
  loginState: LoginState;
  token: string | null;
  currentPayload: Payload | null;
  currentUser: User | null;
  users: User[];
  articles: Article[];
};

const initialState: State = {
  loginState: 'idle',
  token: null,
  currentPayload: null,
  currentUser: null,
  users: [],
  articles: [],
};

@Injectable({
  providedIn: 'root',
})
export class StateService {
  isLoading = signal<boolean>(false);
  private stateSubject: BehaviorSubject<State>;
  private state$ = new BehaviorSubject<State>(initialState);
  private repoUsers = inject(RepoUsersService);
  private repoArticles = inject(RepoArticlesService);

  constructor() {
    this.stateSubject = new BehaviorSubject<State>(initialState);
  }

  getState(): Observable<State> {
    return this.state$.asObservable();
  }
  get state(): State {
    return this.state$.value;
  }

  get currentUser(): User | null {
    return this.state.currentUser as User | null;
  }

  setLoginState(loginState: LoginState): void {
    this.state$.next({ ...this.state$.value, loginState });
  }

  setLogin(token: string) {
    const currentPayload = jwtDecode(token) as Payload;
    localStorage.setItem('books', JSON.stringify({ token }));
    this.repoUsers.getById(currentPayload.id).subscribe((user) => {
      this.state$.next({
        ...this.state$.value,
        loginState: 'logged',
        token,
        currentPayload,
        currentUser: user as User,
      });
    });
  }

  setLogout() {
    localStorage.removeItem('books');
    this.state$.next({
      ...this.state$.value,
      loginState: 'idle',
      token: null,
      currentPayload: null,
      currentUser: null,
    });
  }
  public loaderHide() {
    this.isLoading.set(false);
  }
  public loaderShow() {
    this.isLoading.set(true);
  }

  loadUsers() {
    this.repoUsers.getUsers().subscribe((users) => {
      this.state$.next({
        ...this.state$.value,
        users,
      });
    });
  }

  loadArticles() {
    this.repoArticles.getArticles().subscribe((articles) => {
      this.state$.next({
        ...this.state$.value,
        articles: articles || [],
      });
    });
  }
  loadUserArticles(userId: string) {
    this.repoUsers.getUserArticles(userId).subscribe((articles) => {
      this.state$.next({
        ...this.state$.value,
        articles,
      });
    });
  }

  deleteArticle(id: string) {
    this.repoArticles.deleteArticle(id).subscribe(() => {
      this.loadArticles();
    });
  }
}
