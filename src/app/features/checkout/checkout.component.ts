import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Cart } from '../../core/models/cart.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart$: Observable<Cart | null>;
  checkoutForm: FormGroup;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.cart$ = this.cartService.cart$;
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', Validators.required],
      paymentMethod: ['credit_card', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe();
  }

  placeOrder(): void {
    if (this.checkoutForm.invalid) {
      return;
    }

    this.orderService.createOrder({...this.checkoutForm.value, shipping_address: this.checkoutForm.value.shippingAddress, payment_method: this.checkoutForm.value.paymentMethod}).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/orders', order.id]);
      },
      error: (err) => {
        console.error('Error placing order:', err);
        // Optionally, show an error message to the user
      }
    });
  }

  calculateSubtotal(cart: Cart): number {
    return cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }
}
