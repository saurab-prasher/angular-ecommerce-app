import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

// Subject  is a subclass of observable
// we can use Subject to publish events in our code
// The event will be sent to all of the subscribers
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() {}

  addToCart(theCartItem: CartItem) {
    // check if we already have the item in our cart

    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id

      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
    }

    // check if we found it

    alreadyExistsInCart = existingCartItem !== undefined;

    if (alreadyExistsInCart && existingCartItem) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity

    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;

      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new total price and total quantity to subscribers
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');

    for (let tempCartItem of this.cartItems) {
      console.log(
        tempCartItem.name +
          ':' +
          tempCartItem.quantity +
          'x' +
          tempCartItem.unitPrice
      );
    }
  }
}

interface CartItem {
  id: number;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
}
