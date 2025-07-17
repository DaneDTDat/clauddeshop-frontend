import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'users',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent)
  },
  {
    path: 'shops',
    loadComponent: () => import('./shop-management/shop-management.component').then(m => m.ShopManagementComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./product-management/product-management.component').then(m => m.ProductManagementComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./system-settings/system-settings.component').then(m => m.SystemSettingsComponent)
  }
];
