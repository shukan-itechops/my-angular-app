import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkLoginStatus().pipe(
    tap(isLoggedIn => {
      if (!isLoggedIn) {
        router.navigate(['/login']);
      }
    }),
    map(isLoggedIn => isLoggedIn),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
