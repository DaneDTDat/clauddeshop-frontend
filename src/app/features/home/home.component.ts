import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];
  private readonly baseUrl = `${environment.baseUrl}`;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return '/assets/images/product-placeholder.jpg';
    }
    return `${this.baseUrl}${imagePath}`;
  }

  private async loadProducts() {
    try {
      this.products = await firstValueFrom(this.productService.getProducts());
      this.filteredProducts = [...this.products];
      this.extractCategories();
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  private extractCategories() {
    const categorySet = new Set(this.products.map(p => p.category));
    this.categories = Array.from(categorySet).sort();
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart({ product_id: product.id, quantity: 1 }).subscribe({
      next: () => {
        console.log(`${product.name} added to cart`);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
      }
    });
  }
}
