import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs';

import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { LoadingService } from '@app/core/services/loading.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="app-container">
      <!-- Loading overlay -->
      <div *ngIf="loadingService.isLoading$ | async" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- Auth pages (login, register) -->
      <div *ngIf="isAuthPage" class="auth-layout">
        <router-outlet></router-outlet>
      </div>

      <!-- Main app layout -->
      <div *ngIf="!isAuthPage" class="main-layout">
        <app-header></app-header>
        <div class="content-wrapper">
          <app-sidebar></app-sidebar>
          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      position: relative;
    }

    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(228, 214, 218, 0.8);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }

    .auth-layout {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .main-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .content-wrapper {
      display: flex;
      flex: 1;
      min-height: calc(100vh - 70px);
    }

    .main-content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: rgba(255, 255, 255, 0.02);
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isAuthPage = false;

  constructor(
    private router: Router,
    public loadingService: LoadingService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check if current route is auth page
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: Event) => {
        if (event instanceof NavigationEnd) {
          this.isAuthPage = event.url.startsWith('/auth');
        }
      });

    // Initialize auth state
    this.authService.initializeAuth();
  }
}
