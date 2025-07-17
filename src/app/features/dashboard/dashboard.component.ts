import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ShopService } from '../../core/services/shop.service';
import { ProductService } from '../../core/services/product.service';
import { Shop } from '../../core/models/shop.model';
import { Product } from '../../core/models/product.model';
import { User } from '../../core/models/user.model';
import { firstValueFrom } from 'rxjs';
import { FullImageUrlPipe } from '@app/core/pipes/full-image-url.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FullImageUrlPipe],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div class="welcome-section">
          <h1 class="dashboard-title">Welcome back, {{ currentUser?.first_name }}!</h1>
          <p class="dashboard-subtitle">Manage your shops and products from your dashboard</p>
        </div>
        <div class="quick-actions">
          <button routerLink="/shops/create" class="btn btn-primary">
            <span class="btn-icon">+</span>
            Create Shop
          </button>
          <button routerLink="/products/create" class="btn btn-secondary">
            <span class="btn-icon">📦</span>
            Add Product
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Statistics Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏪</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalShops }}</h3>
              <p class="stat-label">{{ isShopOwner() ? 'My Shops' : 'Total Shops' }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalProducts }}</h3>
              <p class="stat-label">{{ isShopOwner() ? 'My Products' : 'Total Products' }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ totalRevenue | currency }}</h3>
              <p class="stat-label">{{ isShopOwner() ? 'My Revenue' : 'Total Revenue' }}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <h3 class="stat-number">{{ activeOrders }}</h3>
              <p class="stat-label">Active Orders</p>
            </div>
          </div>
        </div>

        <!-- Recent Shops -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">{{ isShopOwner() ? 'My Shops' : 'Recent Shops' }}</h2>
            <a routerLink="/shops" class="section-link">View All</a>
          </div>
          <div class="shops-grid" *ngIf="recentShops.length > 0; else noShops">
            <div *ngFor="let shop of recentShops" class="shop-card">
              <div class="shop-header">
                <h3 class="shop-name">{{ shop.name }}</h3>
                <span class="shop-status" [class]="'status-' + shop.status">{{ shop.status }}</span>
              </div>
              <p class="shop-description">{{ shop.description }}</p>
              <div class="shop-meta">
                <span class="shop-products">{{ shop.productCount }} products</span>
                <span class="shop-created">{{ shop.createdAt | date:'MMM d, y' }}</span>
              </div>
              <div class="shop-actions">
                <button [routerLink]="['/shops', shop.id]" class="btn btn-sm btn-outline">View</button>
                <button [routerLink]="['/shops', shop.id, 'edit']" class="btn btn-sm btn-primary">Edit</button>
              </div>
            </div>
          </div>
          <ng-template #noShops>
            <div class="empty-state">
              <div class="empty-icon">🏪</div>
              <h3 class="empty-title">No shops yet</h3>
              <p class="empty-description">Create your first shop to get started</p>
              <button routerLink="/shops/create" class="btn btn-primary">Create Shop</button>
            </div>
          </ng-template>
        </div>

        <!-- Recent Products -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">{{ isShopOwner() ? 'My Products' : 'Recent Products' }}</h2>
            <a routerLink="/products" class="section-link">View All</a>
          </div>
          <div class="products-grid" *ngIf="recentProducts.length > 0; else noProducts">
            <div *ngFor="let product of recentProducts" class="product-card">
              <div class="product-image">
                <img [src]="product.image_url | fullImageUrl" 
                     [alt]="product.name" class="product-img">
              </div>
              <div class="product-content">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-price">{{ product.price | currency }}</p>
                <span class="product-category">{{ product.category }}</span>
              </div>
              <div class="product-actions">
                <button [routerLink]="['/products', product.id]" class="btn btn-sm btn-outline">View</button>
                <button [routerLink]="['/products', product.id, 'edit']" class="btn btn-sm btn-primary">Edit</button>
              </div>
            </div>
          </div>
          <ng-template #noProducts>
            <div class="empty-state">
              <div class="empty-icon">📦</div>
              <h3 class="empty-title">No products yet</h3>
              <p class="empty-description">Add your first product to get started</p>
              <button routerLink="/products/create" class="btn btn-primary">Add Product</button>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  totalShops = 0;
  totalProducts = 0;
  totalRevenue = 0;
  activeOrders = 0;
  recentShops: Shop[] = [];
  recentProducts: Product[] = [];

  constructor(
    private authService: AuthService,
    private shopService: ShopService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private async loadDashboardData() {
    try {
      // Get current user
      this.currentUser = this.authService.getCurrentUser();

      // Load dashboard statistics based on user role
      if (this.isShopOwner()) {
        await this.loadShopOwnerData();
      } else {
        await this.loadGeneralData();
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  // Role check methods
  isShopOwner(): boolean {
    return this.currentUser?.role === 'shop_owner';
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Load data for shop owners - filtered to their shops only
  private async loadShopOwnerData() {
    try {
      // Get all shops and filter by current user
      const allShops = await firstValueFrom(this.shopService.getShops());
      const userShops = allShops.filter(shop => shop.ownerId === this.currentUser?.id);
      
      this.totalShops = userShops.length;
      this.recentShops = userShops
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      
      // Calculate revenue from user's shops only
      this.totalRevenue = userShops.reduce((total, shop) => total + (shop.revenue || 0), 0);

      // Get products from user's shops only
      if (userShops.length > 0) {
        const shopIds = userShops.map(shop => shop.id);
        const productPromises = shopIds.map(shopId => 
          firstValueFrom(this.productService.getProductsByShop(shopId.toString()))
        );
        
        const productsArrays = await Promise.all(productPromises);
        const userProducts = productsArrays.flat();
        
        this.totalProducts = userProducts.length;
        this.recentProducts = userProducts
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 4);
      } else {
        this.totalProducts = 0;
        this.recentProducts = [];
      }
      
      // Mock active orders for shop owner
      this.activeOrders = Math.floor(Math.random() * 20) + 5;
    } catch (error) {
      console.error('Error loading shop owner data:', error);
    }
  }

  // Load general data for admins and customers
  private async loadGeneralData() {
    try {
      const [shops, products] = await Promise.all([
        firstValueFrom(this.shopService.getShops()),
        firstValueFrom(this.productService.getProducts())
      ]);

      this.totalShops = shops.length;
      this.totalProducts = products.length;
      
      // Calculate total revenue
      this.totalRevenue = shops.reduce((total, shop) => total + (shop.revenue || 0), 0);
      
      this.recentShops = shops
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
        
      this.recentProducts = products
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 4);
      
      // Mock active orders
      this.activeOrders = Math.floor(Math.random() * 50) + 10;
    } catch (error) {
      console.error('Error loading general data:', error);
    }
  }
}
