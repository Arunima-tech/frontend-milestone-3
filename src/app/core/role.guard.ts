import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];
  if (authService.isLoggedIn() && (!expectedRole || authService.hasRole(expectedRole))) {
    return true;
  }

  router.navigate(['/analytics/overview']);
  return false;
};
