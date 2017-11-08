import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from '../global';
import { AuthService, RestService, RestDefaultService } from 'services';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class CartService {

  private cartTotal = new BehaviorSubject({
    guestCardId: null,
    cart: null,
    showImages: null,
    totals: null
  });
  guestCardId;
  cart = null;
  totals = null;
  showImages = false;
  mealAdded = false;

  constructor(
    private http: Http,
    private router: Router,
    private auth: AuthService,
    private rest: RestService
  ) {
    if (this.auth.isLogin()) {
      localStorage.removeItem('guestCardId');
    }
    this.guestCardId = localStorage.getItem('guestCardId');
    this.auth.getLoginSubject().subscribe(res => {
      if (res.action === 'login') {
        if (this.cart && this.cart.id && this.cart.items_count > 0 && this.guestCardId) {
          this.rest.getItem('me', 'customers/me').subscribe(user => {
              const sendData = {
                customerId: user.id,
                storeId: user.store_id
              };
              this.rest.saveItem(true, sendData, 'guest-carts/' + this.guestCardId).subscribe(x => {
                this.setCartTotal();
              }, e => {
                this.setCartTotal();
              })
          });
        } else {
          this.setCartTotal();
        }
        localStorage.removeItem('guestCardId');
        this.assignCartTotal();
      } else {
        this.setCartTotal();
      }
    });
  }

  getCartTotal() {
    return this.cartTotal.asObservable();
  }

  setCartTotal() {
    let cartUrl = 'carts/mine';
    if (!this.auth.isLogin()) {
      if (!this.guestCardId) {
        this.rest.saveItem(false, {}, 'guest-carts').subscribe(cartId => {
          localStorage.setItem('guestCardId', cartId);
          this.guestCardId = cartId;
          this.setCartTotal();
        });
        return;
      }
      cartUrl = 'guest-carts/' + this.guestCardId;
    }
    this.rest.getItem('', cartUrl).subscribe(res => {
        this.cart = res;
        this.showImages = true;
        this.assignCartTotal();
    });

    this.rest.getItem('', cartUrl + '/totals').subscribe(res => {
      this.totals = res;
      this.assignCartTotal();
    });
  }

  assignCartTotal() {
    this.cartTotal.next({
      guestCardId: this.guestCardId,
      cart: this.cart,
      showImages: this.showImages,
      totals: this.totals
    });
  }

  addMealToCart(item) {
    return this.rest.saveItem(false, item, 'cart-add');
  }

  addItemToCart(item) {
    let cartUrl = 'carts/mine';
    if (!this.auth.isLogin()) {
      cartUrl = 'guest-carts/' + this.cart.id;
    }
    return this.rest.saveItem(false, item, cartUrl + '/items');
  }

  removeCartItem(item_id) {
    let cartUrl = 'carts/mine';
    if (!this.auth.isLogin()) {
      cartUrl = 'guest-carts/' + this.guestCardId;
    }
    return this.rest.deleteItem(item_id, cartUrl + '/items/' + item_id);
  }
}
