import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { switchMap, tap } from 'rxjs/operators';
import { FullImageUrlPipe } from '@app/core/pipes/full-image-url.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TitleCasePipe, DatePipe, CurrencyPipe, FullImageUrlPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  isLoading = true;
  errorMessage = '';
  isOwner = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProduct(productId).pipe(
        tap(product => {
          this.product = product;
        }),
        switchMap(product => this.authService.isOwner(product.shop!.ownerId!)),
        tap(isOwner => {
          this.isOwner = isOwner;
          this.isLoading = false;
        })
      ).subscribe({
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message || 'Failed to load product details.';
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'Product ID not found.';
    }
  }

  deleteProduct(): void {
    if (this.product && confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/shops', this.product?.shop_id]); // Or wherever you want to redirect
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.error.message || 'Failed to delete product.';
        }
      });
    }
  }
}
