import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Product Management</h2>
    <p>Product list and management tools will be here.</p>
  `
})
export class ProductManagementComponent {}
