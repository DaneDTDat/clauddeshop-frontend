import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { User, UserLoginRequest, UserCreateRequest, AuthResponse, TokenResponse, UserUpdateRequest, ChangePasswordRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'claudeshop_token';
  private readonly REFRESH_TOKEN_KEY = 'claudeshop_refresh_token';
  private readonly USER_KEY = 'claudeshop_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  initializeAuth(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.logout();
    }
  }

  register(userData: UserCreateRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Registration failed:', error);
          throw error;
        })
      );
  }

  login(credentials: UserLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => {
          console.error('Login failed:', error);
          throw error;
        })
      );
  }

  refreshToken(): Observable<TokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return of();
    }

        return this.http.post<TokenResponse>(`${this.API_URL}/auth/refresh-token`, {
      refresh_token: refreshToken
    }).pipe(
      tap(response => {
        this.storeTokens(response.access_token, response.refresh_token);
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout();
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    
    this.router.navigate(['/auth/login']);
  }

  getProfile(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${this.API_URL}/auth/profile`)
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          this.storeUser(response.user);
        })
      );
  }

  updateProfile(userData: UserUpdateRequest): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.API_URL}/auth/profile`, userData)
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          this.storeUser(response.user);
        })
      );
  }

  changePassword(passwordData: ChangePasswordRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.API_URL}/auth/change-password`, passwordData);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isShopOwner(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'shop_owner';
  }

  canManageShops(): boolean {
    return this.isAdmin() || this.isShopOwner();
  }

  isOwner(ownerId: number): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user ? user.id === ownerId : false)
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.storeTokens(response.tokens.access_token, response.tokens.refresh_token);
    this.storeUser(response.user);
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  private storeUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }
}
