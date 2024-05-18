/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { StateService } from '../services/state.service';
import { HttpInterceptorFn } from '@angular/common/http';

export const loaderInterceptor: HttpInterceptorFn = (
  request: any,
  next: any,
) => {
  const service = inject(StateService);

  service.loaderShow();
  return next(request).pipe(finalize(() => service.loaderHide()));
};
