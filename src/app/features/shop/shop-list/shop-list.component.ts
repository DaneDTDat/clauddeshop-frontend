import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ShopService } from '../../../core/services/shop.service';
import { LoadingService } from '../../../core/services/loading.service';
import { Shop } from '../../../core/models/shop.model';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, RouterLink, GlassCardComponent, CurrencyPipe, DatePipe],
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss']
})
export class ShopListComponent implements OnInit {
  shops$!: Observable<Shop[]>;

  constructor(
    private shopService: ShopService,
    public loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.shops$ = this.shopService.shops$.pipe(
      catchError(err => {
        console.error('Error loading shops in component:', err);
        // In a real app, you might use a toast notification service instead of alert.
        alert('Failed to load shops. Please try refreshing the page.');
        return EMPTY; // Return an empty observable to complete the stream gracefully
      })
    );
    // Trigger the initial fetch of shops. The result is handled by the BehaviorSubject in the service.
    this.shopService.getShops().pipe(
      catchError(err => {
        console.error('Error fetching shops:', err);
        alert('Failed to fetch shops. Please try again.');
        return EMPTY;
      })
    ).subscribe();
  }

  trackByShop(index: number, shop: Shop): number {
    return shop.id;
  }

  deleteShop(shop: Shop): void {
    if (confirm(`Are you sure you want to delete "${shop.name}"? This action cannot be undone.`)) {
      this.shopService.deleteShop(shop.id).pipe(
        catchError(err => {
          console.error('Error deleting shop:', err);
          alert('Failed to delete shop. Please try again.');
          return EMPTY;
        })
      ).subscribe(); // The UI will update automatically via the shops$ stream
    }
  }
}
