import { Routes } from '@angular/router';

export const PAYMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./payment-list/payment-list.component').then(m => m.PaymentListComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./payment-settings/payment-settings.component').then(m => m.PaymentSettingsComponent)
  }
];
