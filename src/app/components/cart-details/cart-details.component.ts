import { Component } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css',
})
export class CartDetailsComponent {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.listCartDetails();
  }

  listCartDetails() {
    // get a handle to teh cart items
    this.cartItems = this.cartService.cartItems;

    // subscribe to the cart total Price
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
    // subscribe to the cart totalprice

    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data)
    );
    // subscribe to the cart totalQuantity
    // compute cart totals and update the UI
    this.cartService.computeCartTotals();
  }
}
