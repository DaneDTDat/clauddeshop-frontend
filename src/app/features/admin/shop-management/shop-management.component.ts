import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shop-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Shop Management</h2>
    <p>Shop list and management tools will be here.</p>
  `
})
export class ShopManagementComponent {}
