import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadComponent: () => import('./components/home.component'),
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login.component'),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./components/sign-up.component'),
  },
  {
    path: 'users',
    loadComponent: () => import('./components/users-card.component'),
  },

  {
    path: 'articles',
    loadComponent: () => import('./components/articles-list.component'),
  },

  {
    path: 'create-article',
    loadComponent: () => import('./components/create-article.component'),
  },

  {
    path: 'update-article/:id',
    loadComponent: () =>
      import('./components/update-article.component').then((m) => m.default),
  },

  {
    path: 'full-article/:id',
    loadComponent: () =>
      import('./components/full-article.component').then((m) => m.default),
  },

  {
    path: 'profile/:id',
    loadComponent: () =>
      import('./components/profile.component').then((m) => m.default),
  },

  { path: '**', redirectTo: 'home' },
];
