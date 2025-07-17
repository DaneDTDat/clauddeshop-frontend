import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  orders$: Observable<Order[]>;

  constructor(private orderService: OrderService) {
    console.log('OrderListComponent constructor');
    this.orders$ = this.orderService.getOrders();
  }

  ngOnInit(): void {}

  calculateOrderTotal(order: Order): number {
    return order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
