import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '@app/core/services/order.service';
import { Order, OrderStatus } from '@app/core/models/order.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-update-order-status',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './update-order-status.component.html',
  styleUrls: ['./update-order-status.component.scss']
})
export class UpdateOrderStatusComponent implements OnInit {
  order$!: Observable<Order>;
  orderId: string | null = null;
  selectedStatus!: OrderStatus;
  orderStatusValues = Object.values(OrderStatus);
  isLoading = true;
  isUpdating = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.order$ = this.orderService.getOrderById(this.orderId);
      this.order$.subscribe(order => {
        this.selectedStatus = order.status;
        this.isLoading = false;
      });
    }
  }

  updateStatus(): void {
    this.isUpdating = true;
    this.errorMessage = null;
    this.successMessage = null;
    if (!this.orderId || !this.selectedStatus) {
      this.errorMessage = 'Order ID or status is missing.';
      return;
    }

    this.orderService.updateOrderStatus(this.orderId!, this.selectedStatus).subscribe({
      next: (updatedOrder) => {
        this.successMessage = `Order #${updatedOrder.id} status updated successfully to ${updatedOrder.status}.`;
        this.errorMessage = null;
        this.isUpdating = false;
        setTimeout(() => this.router.navigate(['/orders/manage']), 2000);
      },
      error: (err) => {
        this.errorMessage = 'Failed to update order status. Please try again.';
        this.successMessage = null;
        console.error(err);
        this.isUpdating = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/orders/manage']);
  }
}
