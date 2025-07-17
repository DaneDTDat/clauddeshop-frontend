import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order$: Observable<Order>;
  private readonly baseUrl = `${environment.baseUrl}`;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
    this.order$ = this.route.paramMap.pipe(
      switchMap(params => {
        const orderId = Number(params.get('id'));
        return this.orderService.getOrderById(orderId.toString());
      })
    );
  }

  ngOnInit(): void {}

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return '/assets/images/product-placeholder.jpg';
    }
    return `${this.baseUrl}${imagePath}`;
  }

  calculateOrderTotal(order: Order): number {
    return order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
