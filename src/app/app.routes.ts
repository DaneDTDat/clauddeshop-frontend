import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/user.model';
import { ManageOrderComponent } from './features/order/manage-order/manage-order.component';
import { UpdateOrderStatusComponent } from './features/order/update-order-status/update-order-status.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN, UserRole.SHOP_OWNER])]
  },
  {
    path: 'browse-shops',
    loadComponent: () => import('./features/shop/browse-shops/browse-shops.component').then(m => m.BrowseShopsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'shops',
    loadChildren: () => import('./features/shop/shop.routes').then(m => m.SHOP_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'admin/shops',
    loadChildren: () => import('./features/shop/shop.routes').then(m => m.SHOP_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/product/product.routes').then(m => m.PRODUCT_ROUTES),
    canActivate: [authGuard] // All authenticated users can view products
  },
  {
    path: 'admin/products',
    loadChildren: () => import('./features/product/product.routes').then(m => m.PRODUCT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'payments',
    loadChildren: () => import('./features/payment/payment.routes').then(m => m.PAYMENT_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])]
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/order/order-list/order-list.component').then(m => m.OrderListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders/manage',
    component: ManageOrderComponent,
    canActivate: [authGuard, roleGuard([UserRole.SHOP_OWNER, UserRole.ADMIN])], // Protect this route
    data: { title: 'Manage Orders' }
  },
  {
    path: 'admin/orders/manage',
    component: ManageOrderComponent,
    canActivate: [authGuard, roleGuard([UserRole.ADMIN])], // Protect this route
    data: { title: 'Manage Orders' }
  },
  {
    path: 'orders/update-status/:id',
    component: UpdateOrderStatusComponent,
    canActivate: [authGuard, roleGuard([UserRole.SHOP_OWNER, UserRole.ADMIN])], // Protect this route
    data: { title: 'Update Order Status' }
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/order/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
