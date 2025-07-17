import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { Shop, ShopCreateRequest, ShopUpdateRequest, ShopListResponse, ShopDetailResponse } from '../models/shop.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private readonly apiUrl = `${environment.apiUrl}/shops`;
  private shopsSubject = new BehaviorSubject<Shop[]>([]);
  public shops$ = this.shopsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('claudeshop_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getShops(): Observable<Shop[]> {
    return this.http.get<ShopListResponse>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(
        map(response => response.shops),
        tap(shops => this.shopsSubject.next(shops))
      );
  }

  getShop(id: string): Observable<Shop> {
    return this.http.get<ShopDetailResponse>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(map(response => response.shop));
  }

  createShop(shop: ShopCreateRequest): Observable<Shop> {
    return this.http.post<ShopDetailResponse>(`${this.apiUrl}/`, shop, { headers: this.getHeaders() })
      .pipe(
        map(response => response.shop),
        tap(() => this.refreshShops())
      );
  }

  updateShop(id: string, shop: ShopUpdateRequest): Observable<Shop> {
    return this.http.put<ShopDetailResponse>(`${this.apiUrl}/${id}`, shop, { headers: this.getHeaders() })
      .pipe(
        map(response => response.shop),
        tap(() => this.refreshShops())
      );
  }

  deleteShop(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.refreshShops())
      );
  }

  private refreshShops(): void {
    this.getShops().subscribe();
  }
}
