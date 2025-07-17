import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { UserRole } from '../../core/models/user.model';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shop-list/shop-list.component').then(m => m.ShopListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./shop-create/shop-create.component').then(m => m.ShopCreateComponent),
    canActivate: [roleGuard([UserRole.ADMIN, UserRole.SHOP_OWNER])]
  },
  {
    path: ':id',
    loadComponent: () => import('./shop-detail/shop-detail.component').then(m => m.ShopDetailComponent)
  },
  {
    path: ':id/products',
    loadComponent: () => import('./shop-products/shop-products.component').then(m => m.ShopProductsComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./shop-edit/shop-edit.component').then(m => m.ShopEditComponent),
    canActivate: [roleGuard([UserRole.ADMIN, UserRole.SHOP_OWNER])]
  }
];
