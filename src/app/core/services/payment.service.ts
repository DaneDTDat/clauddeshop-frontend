import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Payment, PaymentCreateRequest, PaymentListResponse, PaymentDetailResponse } from '../models/payment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('claudeshop_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getPayments(): Observable<Payment[]> {
    return this.http.get<PaymentListResponse>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(map(response => response.payments));
  }

  createPayment(paymentRequest: PaymentCreateRequest): Observable<Payment> {
    return this.http.post<PaymentDetailResponse>(this.apiUrl, paymentRequest, { headers: this.getHeaders() })
      .pipe(map(response => response.payment));
  }
}
