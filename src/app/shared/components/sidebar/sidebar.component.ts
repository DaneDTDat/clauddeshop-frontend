import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth.service';
import { User } from '@app/core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./sidebar.component.scss'],
  template: `
    <aside class="sidebar">
      <div class="sidebar-content">
        <div class="sidebar-header">
          <h3 class="sidebar-title">Navigation</h3>
        </div>
        
        <nav class="sidebar-nav">
          <!-- Customer View -->
          <div *ngIf="isCustomer">
            <div class="nav-section">
              <h4 class="nav-section-title">Explore</h4>
              <a routerLink="/home" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🏠</span>
                <span class="nav-text">Home</span>
              </a>
              <a routerLink="/browse-shops" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🏪</span>
                <span class="nav-text">Browse Shops</span>
              </a>
            </div>
            <div class="nav-section">
                <h4 class="nav-section-title">My Account</h4>
                <a routerLink="/orders" routerLinkActive="active" class="nav-item">
                  <span class="nav-icon">📦</span>
                  <span class="nav-text">My Orders</span>
                </a>
            </div>
          </div>

          <!-- Shop Owner View -->
          <div *ngIf="isShopOwner && !isAdmin">
            <div class="nav-section">
              <h4 class="nav-section-title">Main</h4>
              <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">📊</span>
                <span class="nav-text">Dashboard</span>
              </a>
            </div>
            
            <div class="nav-section">
              <h4 class="nav-section-title">Business</h4>
              <a routerLink="/shops" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🏪</span>
                <span class="nav-text">My Shops</span>
              </a>
              
              <a routerLink="/products" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">📦</span>
                <span class="nav-text">Products</span>
              </a>
              
              <a routerLink="/orders/manage" routerLinkActive="active" class="nav-item">
                <span class="nav-icon">🧾</span>
                <span class="nav-text">Order Management</span>
              </a>
            </div>
          </div>
          
          <!-- Common Links -->
          <div class="nav-section"  *ngIf="!isAdmin">
            <h4 class="nav-section-title">Account</h4>
            <a routerLink="/profile" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👤</span>
              <span class="nav-text">Profile</span>
            </a>
            <a (click)="logout()" class="nav-item logout-btn">
              <span class="nav-icon">🚪</span>
              <span class="nav-text">Logout</span>
            </a>
          </div>
          
          <!-- Admin Only -->
          <div class="nav-section" *ngIf="isAdmin">
            <h4 class="nav-section-title">Administration</h4>
            <!-- <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item"> -->
            <!-- <span class="nav-icon">📊</span> -->
            <!-- <span class="nav-text">Dashboard</span> -->
            <!-- </a> -->
            <a routerLink="/admin/shops" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🏪</span>
              <span class="nav-text">Shops</span>
            </a>
            <a routerLink="/admin/products" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📦</span>
              <span class="nav-text">Products</span>
            </a>
            <a routerLink="/admin/users" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span>
              <span class="nav-text">Users</span>
            </a>
            <a routerLink="/admin/orders/manage" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🧾</span>
              <span class="nav-text">Orders</span>
            </a>
          </div>
        </nav>
        
        <div class="sidebar-footer">
          <div class="user-summary" *ngIf="currentUser">
            <div class="user-avatar-small">
              {{ getUserInitials() }}
            </div>
            <div class="user-details">
              <div class="user-name-small">{{ currentUser.email }}</div>
              <div class="user-role-small">{{ currentUser.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  isShopOwner: boolean = false;
  isAdmin: boolean = false;
  isCustomer: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      this.currentUser = user;
      this.isShopOwner = this.currentUser?.role === 'shop_owner';
      this.isAdmin = this.currentUser?.role === 'admin';
      this.isCustomer = this.currentUser?.role === 'customer';
    });
  }

  getUserInitials(): string {
    if (!this.currentUser?.email) return 'U';
    return this.currentUser.email.charAt(0).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }
}
