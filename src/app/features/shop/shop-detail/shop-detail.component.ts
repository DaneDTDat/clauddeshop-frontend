import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe } from '@angular/common';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { Shop } from '../../../core/models/shop.model';
import { switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe, DatePipe, GlassCardComponent],
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss']
})
export class ShopDetailComponent implements OnInit {
  shop: Shop | undefined;
  isLoading = true;
  errorMessage = '';
  shopId!: string;
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shopService: ShopService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id')!;
    if (this.shopId) {
      this.loadShopDetails();
    } else {
      this.isLoading = false;
      this.errorMessage = 'Shop ID not found.';
    }
  }

  loadShopDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.shopService.getShop(this.shopId).pipe(
      tap(shop => {
        this.shop = shop;
      }),
      switchMap(shop => this.authService.isOwner(shop.ownerId)),
      tap(isOwner => {
        this.isOwner = isOwner;
        this.isLoading = false;
      })
    ).subscribe({
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Failed to load shop details.';
      }
    });
  }

  deleteShop(): void {
    if (confirm('Are you sure you want to delete this shop?')) {
      this.isLoading = true;
      this.shopService.deleteShop(Number(this.shopId)).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/shops']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message || 'Failed to delete shop.';
        }
      });
    }
  }
}
