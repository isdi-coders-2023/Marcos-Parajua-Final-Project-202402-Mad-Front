import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { loaderInterceptor } from '../interceptors/loader.interceptor';
import { authInterceptor } from '../interceptors/logged.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([loaderInterceptor, authInterceptor]),
    ),
  ],
};
