import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

// This is a placeholder service. In a real application, you would define
// proper models for the API responses and handle errors more gracefully.

@Injectable({
  providedIn: 'root'
})
export class UserService {

  // In a real app, these would come from a config file
  private readonly MOCK_API_URL = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) { }

  async getAccountStats(): Promise<{ shops: number; products: number; revenue: number; }> {
    // This is a mock implementation. In a real app, you would call
    // your backend endpoints like /api/shops/my and /api/payments/summary
    console.log('Fetching account stats...');

    // Mock API calls to simulate fetching data
    const [shops, products, payments] = await Promise.all([
      firstValueFrom(this.http.get<any[]>(`${this.MOCK_API_URL}/users`)), // Mock for shops
      firstValueFrom(this.http.get<any[]>(`${this.MOCK_API_URL}/photos`)), // Mock for products
      firstValueFrom(this.http.get<any[]>(`${this.MOCK_API_URL}/posts`)) // Mock for payments
    ]);

    // Mock revenue calculation
    const revenue = payments.reduce((acc, curr) => acc + (curr.id * 10), 0);

    const stats = {
      shops: shops.length,
      products: products.length / 10, // Just to get a smaller number
      revenue: revenue
    };

    console.log('Account stats fetched:', stats);
    return stats;
  }
}
