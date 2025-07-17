import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ShopService } from '../../../core/services/shop.service';
import { Shop } from '../../../core/models/shop.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shop-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './shop-products.component.html',
  styleUrls: ['./shop-products.component.scss']
})
export class ShopProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  shop: Shop | null = null;
  shopId: string | null = null;
  searchTerm = '';
  selectedCategory = '';
  categories: string[] = [];
  private readonly baseUrl = `${environment.baseUrl}`;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shopService: ShopService,
    private cartService: CartService,
  ) { }

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id');
    if (this.shopId) {
      this.loadShopDetails(this.shopId);
      this.loadProducts(this.shopId);
    }
  }

  loadShopDetails(shopId: string): void {
    this.shopService.getShop(shopId).subscribe({
      next: (shop) => this.shop = shop,
      error: (err) => console.error('Error loading shop details:', err)
    });
  }

  loadProducts(shopId: string): void {
    this.productService.getProductsByShop(shopId).subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...this.products];
        this.extractCategories();
      },
      error: (err) => {
        console.error('Error loading products for shop:', err);
      }
    });
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

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return '/assets/images/product-placeholder.jpg';
    }
    return `${this.baseUrl}${imagePath}`;
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
