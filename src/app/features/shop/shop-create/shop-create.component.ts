import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { ShopCreateRequest } from '../../../core/models/shop.model';
import { GlassCardComponent } from '../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-shop-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GlassCardComponent],
  templateUrl: './shop-create.component.html',
  styleUrls: ['./shop-create.component.scss']
})
export class ShopCreateComponent implements OnInit {
  shopForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private shopService: ShopService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.shopForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      description: [''],
      address: ['', [Validators.required, Validators.maxLength(500)]],
      phone: ['', [Validators.maxLength(20)]],
      email: ['', [Validators.email, Validators.maxLength(255)]]
    });
  }

  get f() { return this.shopForm.controls; }

  onSubmit(): void {
    if (this.shopForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newShop: ShopCreateRequest = this.shopForm.value;

    this.shopService.createShop(newShop).subscribe({
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
