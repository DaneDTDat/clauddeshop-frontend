import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderService } from '@app/core/services/order.service';
import { Order, OrderStatus } from '@app/core/models/order.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {
  orders$: Observable<Order[]>;
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  searchTerm = '';
  selectedStatus: OrderStatus | '' = '';
  orderStatusValues = Object.values(OrderStatus);

  constructor(private orderService: OrderService) {
    this.orders$ = this.orderService.getOrdersForShopOwner();
  }

  ngOnInit(): void {
    this.orders$.subscribe(orders => {
      this.allOrders = orders;
      this.applyFilters();
      this.isLoading = false;
    });
  }

  applyFilters(): void {
    let orders = [...this.allOrders];

    if (this.searchTerm) {
      const lowercasedTerm = this.searchTerm.toLowerCase();
      orders = orders.filter(order =>
        order.id.toString().includes(lowercasedTerm) ||
        (order.user?.email && order.user.email.toLowerCase().includes(lowercasedTerm))
      );
    }

    if (this.selectedStatus) {
      orders = orders.filter(order => order.status === this.selectedStatus);
    }

    this.filteredOrders = orders;
  }

  getSeverity(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.Pending:
        return 'info';
      case OrderStatus.Processing:
        return 'warning';
      case OrderStatus.Shipped:
        return 'primary';
      case OrderStatus.Delivered:
        return 'success';
      case OrderStatus.Cancelled:
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
