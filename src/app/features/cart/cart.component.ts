import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { CartService } from '../../core/services/cart.service';
import { Cart, CartItem } from '../../core/models/cart.model';
import { FullImageUrlPipe } from '../../core/pipes/full-image-url.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FullImageUrlPipe],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart$: Observable<Cart | null>;

  constructor(private cartService: CartService) {
    this.cart$ = this.cartService.cart$;
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe();
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity > 0) {
      this.cartService.updateCartItem(item.id, { quantity }).subscribe();
    } else {
      this.removeFromCart(item);
    }
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.id).subscribe();
  }

  calculateSubtotal(cart: Cart): number {
    return cart.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }
}
