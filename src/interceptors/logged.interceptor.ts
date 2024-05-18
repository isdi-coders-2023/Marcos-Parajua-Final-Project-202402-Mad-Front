import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StateService } from '../services/state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const stateService = inject(StateService);
  const { loginState, token } = stateService.state;

  if (loginState !== 'logged') {
    return next(req);
  }

  console.log('authInterceptor', token);
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
