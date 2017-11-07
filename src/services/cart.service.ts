import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from '../global';
import { AuthService, RestService } from 'services';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class CartService {

  private cartTotal = new BehaviorSubject({
    cart: null,
    showImages: null,
    totals: null
  });
  cart = null;
  totals = null;
  showImages = false;
  giftAdded = false;
  mealAdded = false;

  constructor(
    private http: Http,
    private router: Router,
    private auth: AuthService,
    private rest: RestService
  ) {
    this.setCartTotal();
  }

  getCartTotal() {
    return this.cartTotal.asObservable();
  }

  setCartTotal() {
    let cardId = 'mine';
    if (!this.auth.isLogin()) {
      if (!this.cart || !this.cart.id) {alert("f");
        this.rest.saveItem(false, {}, 'carts').sgubscribe(cartId => {
          this.cart = {
            id: cartId
          };
          this.setCartTotal();
        });
        return;
      }
      cardId = this.cart.id;
    }
    this.rest.getItem('', 'carts/' + cardId).subscribe(res => {
        this.cart = res;
        this.showImages = true;
        this.cartTotal.next({
          cart: this.cart,
          showImages: this.showImages,
          totals: this.totals
        });
    });

    this.rest.getItem('', 'carts/' + cardId + '/totals').subscribe(res => {
      this.totals = res;
      this.cartTotal.next({
        cart: this.cart,
        showImages: this.showImages,
        totals: this.totals
      });
    });
  }

  addItemToCart(item) {
    let cardId = 'mine';
    if (!this.auth.isLogin()) {
      if (!this.cart || !this.cart.id) {
        this.setCartTotal();
        return this.getCartTotal().subscribe(data => {
          if (data.cart && data.cart.id) {
            return this.addItemToCart(item);
          }
        });
      } else {
        cardId = this.cart.id;
      }
    }
    return this.rest.saveItem(false, item, 'carts/' + cardId + '/items');
  }

  removeCartItem(item_id) {
    let cardId = 'mine';
    if (!this.auth.isLogin()) {
      if (!this.cart || !this.cart.id) {
        this.setCartTotal();
        return this.getCartTotal().subscribe(data => {
          if (data.cart && data.cart.id) {
            return this.removeCartItem(item_id);
          }
        });
      } else {
        cardId = this.cart.id;
      }
    }
    return this.rest.deleteItem(item_id, 'carts/' + cardId + '/items/' + item_id);
  }
}
