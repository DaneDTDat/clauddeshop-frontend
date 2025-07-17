import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { User, UserRole } from '../../../core/models/user.model';
import { Cart } from '../../../core/models/cart.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  styleUrls: ['./header.component.scss'],
  template: `
    <header class="header">
      <div class="header-content">
        <a routerLink="/" class="logo">
          <h1 class="logo-text">ClaudeShop</h1>
          <span *ngIf="isShopOwner" class="logo-subtitle">Shop Owner Portal</span>
          <span *ngIf="isAdmin" class="logo-subtitle">Admin Portal</span>
          <span *ngIf="isCustomer" class="logo-subtitle">Online shopping made easy</span>
        </a>
        
        <nav class="nav-menu">
          <!-- Links for Customers -->
          <ng-container *ngIf="isCustomer">
            <a routerLink="/home" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🏠</span>
              Home
            </a>
            <a routerLink="/browse-shops" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🛍️</span>
              Shops
            </a>
            <a routerLink="/orders" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🚚</span>
              My Orders
            </a>
            <a routerLink="/cart" routerLinkActive="active" class="nav-link cart-link">
              <span class="nav-icon">🛒</span>
              Cart
              <span *ngIf="(cart$ | async)?.items?.length" class="cart-badge">{{ (cart$ | async)?.items?.length }}</span>
            </a>
          </ng-container>

          <!-- Links for Shop Owners -->
          <ng-container *ngIf="isShopOwner && !isAdmin">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📊</span>
              Dashboard
            </a>
            <a routerLink="/shops" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🏠</span>
              My Shop
            </a>
            <a routerLink="/products" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📦</span>
              My Products
            </a>
            <a routerLink="/orders/manage" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🧾</span>
              Order Management
            </a>
          </ng-container>

          <!-- Links for Admins -->
          <ng-container *ngIf="isAdmin">
            <!-- <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📊</span>
              Dashboard
            </a> -->
            <a routerLink="/admin/shops" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🏪</span>
              Shops
            </a>
            <a routerLink="/admin/products" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">📦</span>
              Products
            </a>
            <a routerLink="/admin/orders/manage" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">🧾</span>
              Orders
            </a>
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-link">
              <span class="nav-icon">👥</span>
              Users
            </a>
          </ng-container>
        </nav>

        <div class="user-menu">
          <div class="user-dropdown" [class.open]="isUserMenuOpen">
            <button class="user-button" (click)="toggleUserMenu()">
              <div class="user-avatar">
                {{ getUserInitials() }}
              </div>
              <div class="user-info" *ngIf="currentUser">
                <span class="user-name">{{ currentUser.first_name }} {{ currentUser.last_name }}</span>
                <span class="user-role">{{ currentUser.role }}</span>
              </div>
              <span class="dropdown-arrow">▼</span>
            </button>
            
            <div class="dropdown-menu" *ngIf="isUserMenuOpen">
              <a routerLink="/profile" class="dropdown-item" (click)="closeUserMenu()">
                <span class="dropdown-icon">👤</span>
                Profile
              </a>
              <hr class="dropdown-divider">
              <button class="dropdown-item logout-item" (click)="logout()">
                <span class="dropdown-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isUserMenuOpen = false;
  cart$: Observable<Cart | null>;
  UserRole = UserRole; // Expose enum to template

  private userSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) {
    this.cart$ = this.cartService.cart$;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.isUserMenuOpen = false;
    }
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.cartService.getCart().subscribe();
      } else {
        this.cartService.clearCart();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  get isCustomer(): boolean {
    return this.currentUser?.role === UserRole.CUSTOMER;
  }

  get isShopOwner(): boolean {
    return this.currentUser?.role === UserRole.SHOP_OWNER;
  }

  get isAdmin(): boolean {
    return this.currentUser?.role === UserRole.ADMIN;
  }

  getUserInitials(): string {
    if (!this.currentUser) return 'U';
    const firstName = this.currentUser.first_name || '';
    const lastName = this.currentUser.last_name || '';
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  logout(): void {
    this.closeUserMenu();
    this.authService.logout();
    console.log('Logout successful');
    this.router.navigate(['/auth/login']);
  }
}
