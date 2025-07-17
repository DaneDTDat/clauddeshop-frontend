import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service'; // Assuming you have an AuthService

@Injectable({
  providedIn: 'root'
})
export class ShopOwnerGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (user && (user.role === 'shop_owner' || user.role === 'admin')) {
          return true;
        }
        // Redirect to a 'not-authorized' page or home page
        return this.router.createUrlTree(['/']);
      })
    );
  }
}
