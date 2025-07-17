import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('claudeshop_token')
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  addToCart(request: AddToCartRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, request, { headers: this.getHeaders() }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  updateCartItem(itemId: number, request: UpdateCartItemRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${itemId}`, request, { headers: this.getHeaders() }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${itemId}`, { headers: this.getHeaders() }).pipe(
      tap(() => this.getCart().subscribe())
    );
  }

  clearCart(): void {
    this.cartSubject.next(null);
  }
}
