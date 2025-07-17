import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ShopService } from 'src/app/core/services/shop.service';
import { ProductService } from 'src/app/core/services/product.service';
import { UploadService } from 'src/app/core/services/upload.service';
import { Shop } from 'src/app/core/models/shop.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent implements OnInit {
  productForm!: FormGroup;
  shops$!: Observable<Shop[]>;
  isLoading = false;
  errorMessage = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private shopService: ShopService,
    private uploadService: UploadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required, Validators.maxLength(100)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      shop_id: [null, [Validators.required]],
      image_url: ['']
    });

    this.shops$ = this.shopService.getShops();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.productForm.patchValue({ image_url: file.name });
    }
  }

  get f() { return this.productForm.controls; }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.selectedFile) {
      this.uploadService.upload(this.selectedFile).subscribe({
        next: (response) => {
          this.productForm.patchValue({ image_url: response.filepath });
          this.createProduct();
        },
        error: (err) => {
          this.errorMessage = 'Failed to upload image. Please try again.';
          this.isLoading = false;
        }
      });
    } else {
      this.createProduct();
    }
  }

  createProduct(): void {
    this.productService.createProduct(this.productForm.value).subscribe({
      next: (product) => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error.message || 'An unexpected error occurred.';
      }
    });
  }
}
