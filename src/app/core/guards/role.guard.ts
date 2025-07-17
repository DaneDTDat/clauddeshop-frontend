import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';
import { map } from 'rxjs/operators';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
      map(user => {
        if (user && allowedRoles.includes(user.role)) {
          return true;
        }
        
        // Redirect to a default page if the user doesn't have the required role
        router.navigate(['/products']);
        return false;
      })
    );
  };
};
