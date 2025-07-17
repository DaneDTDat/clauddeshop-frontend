import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { LoadingService } from '../../../core/services/loading.service';
import { AuthService } from '@app/core/services/auth.service';
import { ShopService } from '@app/core/services/shop.service';
import { Product } from '../../../core/models/product.model';
import { User, UserRole } from '@app/core/models/user.model';
import { firstValueFrom, forkJoin, of, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { FullImageUrlPipe } from '@app/core/pipes/full-image-url.pipe';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, FullImageUrlPipe],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  categories: string[] = [];
  private readonly baseUrl = `${environment.baseUrl}`;

  currentUser: User | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public loadingService: LoadingService,
    private authService: AuthService,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  trackByProduct(index: number, product: Product): number {
    return product.id;
  }

  onSearch() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
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
        // Optionally, show a success notification
        console.log(`${product.name} added to cart`);
      },
      error: (err) => {
        // Optionally, show an error notification
        console.error('Error adding to cart:', err);
      }
    });
  }

  private async loadProducts() {
    this.loadingService.show();
    try {
      this.currentUser = this.authService.getCurrentUser();
      let products$: Observable<Product[]>;

      if (this.currentUser && this.currentUser.role === UserRole.ADMIN) {
        products$ = this.productService.getProducts();
      } else if (this.currentUser && this.currentUser.role === UserRole.SHOP_OWNER) {
        products$ = this.shopService.getShops().pipe(
          switchMap(shops => {
            const ownerShops = shops.filter(shop => shop.ownerId === this.currentUser?.id);
            if (ownerShops.length === 0) {
              return of([]);
            }
            const productRequests = ownerShops.map(shop => this.productService.getProductsByShop(shop.id.toString()));
            return forkJoin(productRequests).pipe(
              map(productArrays => productArrays.flat())
            );
          })
        );
      } else {
        products$ = this.productService.getProducts();
      }

      this.products = await firstValueFrom(products$);
      this.filteredProducts = [...this.products];
      this.extractCategories();
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      this.loadingService.hide();
    }
  }

  private extractCategories() {
    const categorySet = new Set(this.products.map(p => p.category));
    this.categories = Array.from(categorySet).sort();
  }

  private applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;
      
      const matchesStatus = !this.selectedStatus || 
        product.status === this.selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }

  async deleteProduct(product: Product): Promise<void> {
    if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      try {
        await firstValueFrom(this.productService.deleteProduct(product.id));
        this.products = this.products.filter(p => p.id !== product.id);
        this.applyFilters();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  }
}
