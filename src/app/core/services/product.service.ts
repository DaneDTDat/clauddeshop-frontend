import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Product, ProductCreateRequest, ProductUpdateRequest, ProductListResponse, ProductDetailResponse } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('claudeshop_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getProducts(shopId?: string): Observable<Product[]> {
    const url = shopId ? `${this.apiUrl}?shop_id=${shopId}` : this.apiUrl;
    return this.http.get<ProductListResponse>(url, { headers: this.getHeaders() })
      .pipe(
        map(response => response.products),
        tap(products => this.productsSubject.next(products))
      );
  }

  getProductsByShop(shopId: string): Observable<Product[]> {
    return this.http.get<ProductListResponse>(`${this.apiUrl}/shop/${shopId}`, { headers: this.getHeaders() })
      .pipe(
        map(response => response.products)
      );
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<ProductDetailResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(map(response => response.product));
  }

  createProduct(product: ProductCreateRequest): Observable<Product> {
    product = {...product, shop_id: Number(product.shop_id)}
    return this.http.post<ProductDetailResponse>(`${this.apiUrl}/`, product, { headers: this.getHeaders() })
      .pipe(
        map(response => response.product),
        tap(() => this.refreshProducts())
      );
  }

  updateProduct(id: string, product: ProductUpdateRequest): Observable<Product> {
    return this.http.put<ProductDetailResponse>(`${this.apiUrl}/${id}`, product, { headers: this.getHeaders() })
      .pipe(
        map(response => response.product),
        tap(() => this.refreshProducts())
      );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refreshProducts())
      );
  }

  private refreshProducts(): void {
    this.getProducts().subscribe();
  }
}
