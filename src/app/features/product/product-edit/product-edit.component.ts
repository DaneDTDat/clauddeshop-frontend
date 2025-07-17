import { Component, OnInit } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { UploadService } from '../../../core/services/upload.service';
import { Product, ProductStatus } from '../../../core/models/product.model';
import { switchMap, tap } from 'rxjs/operators';
import { FullImageUrlPipe } from '../../../core/pipes/full-image-url.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FullImageUrlPipe,
    TitleCasePipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  product: Product | null = null;
  isLoading = true;
  errorMessage = '';
  isOwner = false;
  productStatuses = Object.values(ProductStatus);
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private authService: AuthService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      this.isLoading = false;
      this.errorMessage = 'Product ID not found.';
      return;
    }

    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required, Validators.maxLength(100)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      status: [ProductStatus.AVAILABLE, Validators.required],
      image_url: ['']
    });

    this.productService.getProduct(productId).pipe(
      tap(product => {
        this.product = product;
        this.productForm.patchValue(product);
      }),
      switchMap(product => this.authService.isOwner(product.shop!.ownerId!)),
      tap(isOwner => {
        this.isOwner = isOwner;
        if (!isOwner) {
          this.errorMessage = 'You do not have permission to edit this product.';
        }
        this.isLoading = false;
      })
    ).subscribe({
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'Failed to load product details.';
      }
    });
  }

  get f() { return this.productForm.controls; }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.productForm.patchValue({ image_url: file.name });
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid || !this.product) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.selectedFile) {
      this.uploadService.upload(this.selectedFile).subscribe({
        next: (response) => {
          this.productForm.patchValue({ image_url: response.filepath });
          this.updateProduct();
        },
        error: (err) => {
          this.errorMessage = 'Failed to upload image. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.updateProduct();
    }
  }

  updateProduct(): void {
    if (!this.product) return;

    this.productService.updateProduct(String(this.product.id), this.productForm.value).subscribe({
      next: (updatedProduct) => {
        this.isLoading = false;
        this.product = updatedProduct;
        this.router.navigate(['/products', this.product.id]);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'An unexpected error occurred.';
      }
    });
  }
}
