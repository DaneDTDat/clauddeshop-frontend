import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, UserListResponse } from '../models/user.model';
import { Shop, ShopListResponse } from '../models/shop.model';
import { environment } from '../../../environments/environment';

export interface AdminStats {
  totalUsers: number;
  totalShops: number;
  totalProducts: number;
  totalRevenue: number;
  recentActivity: AdminActivity[];
}

export interface AdminActivity {
  id: string;
  type: 'user_registered' | 'shop_created' | 'product_added' | 'payment_processed';
  description: string;
  timestamp: string;
  userId?: string;
  shopId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('claudeshop_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.apiUrl}/dashboard/stats`, { headers: this.getHeaders() });
  }

  // User Management Methods
  getUsers(params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }): Observable<UserListResponse> {
    let queryParams = '';
    if (params) {
      const searchParams = new URLSearchParams();
      if (params.role) searchParams.append('role', params.role);
      if (params.status) searchParams.append('status', params.status);
      if (params.search) searchParams.append('search', params.search);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      queryParams = searchParams.toString() ? `?${searchParams.toString()}` : '';
    }
    return this.http.get<UserListResponse>(`${this.apiUrl}/users${queryParams}`, { headers: this.getHeaders() });
  }

  getUser(userId: number): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.apiUrl}/users/${userId}`, { headers: this.getHeaders() });
  }

  updateUserRole(userId: number, role: string): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/users/${userId}/role`, { role }, { headers: this.getHeaders() });
  }

  toggleUserStatus(userId: number): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/users/${userId}/status`, {}, { headers: this.getHeaders() });
  }

  // Shop Management Methods
  getAllShops(): Observable<Shop[]> {
    return this.http.get<ShopListResponse>(`${this.apiUrl}/shops`, { headers: this.getHeaders() })
      .pipe(map(response => response.shops));
  }

  updateShopStatus(shopId: string, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/shops/${shopId}/status`, { status }, { headers: this.getHeaders() });
  }

  // Analytics Methods
  getAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`, { headers: this.getHeaders() });
  }

  getSystemHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`, { headers: this.getHeaders() });
  }
}
