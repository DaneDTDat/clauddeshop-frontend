import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { Shop, ShopStatus, ShopUpdateRequest } from '../../../core/models/shop.model';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-shop-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GlassCardComponent],
  templateUrl: './shop-edit.component.html',
  styleUrls: ['./shop-edit.component.scss']
})
export class ShopEditComponent implements OnInit {
  shopForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  shopId!: string;
  shop!: Shop;
  shopStatuses = Object.values(ShopStatus);

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.shopId = this.route.snapshot.paramMap.get('id')!;
    this.shopForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      description: [''],
      address: ['', [Validators.required, Validators.maxLength(500)]],
      phone: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(255)]],
      status: [ShopStatus.ACTIVE, Validators.required]
    });

    this.loadShopData();
  }

  loadShopData(): void {
    this.isLoading = true;
    this.shopService.getShop(this.shopId).subscribe({
      next: (shop) => {
        this.shop = shop;
        this.shopForm.patchValue(shop);
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Failed to load shop data.';
      }
    });
  }

  get f() { return this.shopForm.controls; }

  onSubmit(): void {
    if (this.shopForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const updatedShop: ShopUpdateRequest = this.shopForm.value;

    this.shopService.updateShop(this.shopId, updatedShop).subscribe({
      next: (shop) => {
        this.isLoading = false;
        this.router.navigate(['/shops', shop.id]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'An unexpected error occurred. Please try again.';
      }
    });
  }
}
