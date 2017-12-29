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
    showImages: false,
    totals: null,
    loading: true,
    mealAdded: false,
    mealCartItem: null,
    mealPreferences: null,
    billingAddress: null,
    shippingAddress: null,
    subscription: null
  });
  guestCardId;
  cart = null;
  totals = null;
  showImages = false;
  loading = true;
  mealAdded = false;
  mealCartItem = null;
  billingAddress = null;
  shippingAddress = null;
  mealPreferences = null;
  paymentInfo = null;
  subscription = null;

  constructor(
    private http: Http,
    private router: Router,
    private auth: AuthService,
    private rest: RestService
  ) {
    if (this.auth.isLogin()) {
      localStorage.removeItem('guestCardId');
      this.initUserSubscription();
    }
    this.guestCardId = localStorage.getItem('guestCardId');
    this.auth.getLoginSubject().subscribe(res => {
      if (res.action === 'login') {
        if (this.guestCardId && this.cart && this.cart.id) {
          this.rest.saveItem(false, {}, 'guest-customer-cart/' + this.cart.id).subscribe(x => {
            this.setCartTotal(true);
          }, e => {
            this.setCartTotal(true);
          })
        } else {
          this.setCartTotal(true);
        }
        this.guestCardId = null;
        localStorage.removeItem('guestCardId');
        this.assignCartTotal();
      } else {
        this.setCartTotal(true);
      }
    });
  }

  setOrderSubscriptionNull() {
    this.subscription = null;
    this.assignCartTotal();
  }

  initUserSubscription() {
    this.rest.getItem(1, 'my-subscription').subscribe(subs => {
      if(subs[0] <= 0) {
        this.subscription = {
          has_subscription: false
        };
        this.assignCartTotal();
        return;
      }
      let currentSub = subs[1].find(x => x.is_active == 1);
      if(!currentSub) {
        this.subscription = {
          has_subscription: false
        };
        this.assignCartTotal();
        return;
      }
      this.rest.getItem(1, 'view-subscription-details/' + currentSub.subscription_id).subscribe(sub => {
        if(!sub || !sub[0]) {
          this.subscription = null;
          this.assignCartTotal();
          return;
        }
        this.subscription = Object.assign({has_subscription: true}, currentSub, sub[0]);
        this.assignCartTotal();
      })
    })
  }

  initVariables() {
    this.cart = null;
    this.showImages = false;
    this.totals = null;
    this.loading = true;
    this.mealAdded = false
    this.mealPreferences = null;
    this.mealCartItem = null;
    this.billingAddress = null;
    this.shippingAddress = null;
    this.assignCartTotal();
  }

  setPaymentInfo(data) {
    this.paymentInfo = data;
  }

  getPaymentInfo() {
    return this.paymentInfo;
  }

  getCartTotal() {
    return this.cartTotal.asObservable();
  }

  setCartTotal(init) {
    let cartUrl = 'carts/mine';
    if (init) {
      this.initVariables();
    } 
    this.cart = {loading: true};
    if (!this.auth.isLogin()) {
      if (!this.guestCardId) {
        this.rest.saveItem(false, {}, 'guest-carts').subscribe(cartId => {
          localStorage.setItem('guestCardId', cartId);
          this.guestCardId = cartId;
          this.setCartTotal(false);
        });
        return;
      }
      cartUrl = 'guest-carts/' + this.guestCardId;
    } else {             
      this.initUserSubscription();
    }    
    this.rest.getItem('', cartUrl).subscribe(res => {
        this.cart = res;
        this.cart.loading = false;
        this.showImages = true;
        this.loading = false;
        this.assignCartTotal();
    });

    this.rest.getItem('', cartUrl + '/totals').subscribe(res => {
      this.totals = res;
      this.loading = false;
      this.assignCartTotal();
    });
  }

  setMealAdded(cond) {
    this.mealAdded = cond;
    this.assignCartTotal();
  }

  checkMealAddedInCart(items) {
    return items.findIndex(x => x.sku === 'freshbox-subscription') !== -1;
  }

  getMealItemFromCart() {
    return this.cart.items.filter(x => x.sku === 'freshbox-subscription')[0];
  }

  assignCartTotal() {
    if (this.cart && this.totals && this.totals.items.length > 0 && this.checkMealAddedInCart(this.cart.items)) {
      if (!this.mealPreferences || this.mealPreferences.length === 0) {
        this.cart.mealPreferenceLoading = true;
        this.rest.getItems(1, [], 1000, 'meals/user-meal-search', 'criteria').subscribe(res => {
          this.mealPreferences = res;
          this.mealPreferences[0].map(x => {
              x.options = x.options.filter(y => parseInt(y.is_active, 10) === 1);
              return x;
          });
          this.mealPreferences[0] = this.mealPreferences[0].filter(x => x.options.length > 0 && parseInt(x.is_active, 10) === 1);
          this.cart.mealPreferenceLoading = false;
          this.assignCartTotal();
        });
      }
      this.mealAdded = true;
      this.mealCartItem = this.getMealItemFromCart();
      this.mealCartItem = Object.assign({}, this.mealCartItem, this.totals.items.filter(x => x.item_id === this.mealCartItem.item_id)[0]);
      this.mealCartItem.options = JSON.parse(this.mealCartItem.options);
      this.mealCartItem.options.forEach(x => {
        const key = x.label.toLowerCase().split(' ').join('_');
        if (key === 'meal_preference') {
          x.value = x.value.split(',');
        }
        this.mealCartItem[key] = x.value;
      });
    }
    if (this.cart) {
      this.billingAddress = this.cart.billing_address;
      if (this.cart.extension_attributes && this.cart.extension_attributes.shipping_assignments.length > 0) {
        this.shippingAddress = this.cart.extension_attributes.shipping_assignments[0].shipping.address;
      }
    }

    this.cartTotal.next({
      guestCardId: this.guestCardId,
      cart: this.cart,
      showImages: this.showImages,
      totals: this.totals,
      loading: this.loading,
      mealAdded: this.mealAdded,
      mealCartItem: this.mealCartItem,
      mealPreferences: this.mealPreferences,
      billingAddress: this.billingAddress,
      shippingAddress: this.shippingAddress,
      subscription: this.subscription
    });
  }

  addMealToCart(item) {
    return this.rest.saveItem(false, item, 'cart-add');
  }

  increaseCartItem(item) {
    if (item.sku === 'freshbox-subscription') {
      this.setMealAdded(true);
    }
    if (this.cart && this.cart.items) {
      this.cart.items_count += 1;
      this.cart.items.push(item);
      this.assignCartTotal();
      setTimeout(() => this.setCartTotal(true), 200);
    } else {
      this.setCartTotal(true);
    }
  }

  addItemToCart(item) {
    let cartUrl = 'carts/mine';
    if (!this.auth.isLogin()) {
      cartUrl = 'guest-carts/' + this.cart.id;
    }
    return this.rest.saveItem(false, item, cartUrl + '/items');
  }

  decreaseCartItem(item_id) {
    if (this.cart && this.cart.items) {
      this.cart.items_count -= 1;
      this.cart.items = this.cart.items.filter(y => y.item_id !== item_id);
      this.totals.items = this.totals.items.filter(y => y.item_id !== item_id);
      this.assignCartTotal();
      this.setCartTotal(true);
    } else {
      this.setCartTotal(true);
    }
  }

  removeCartItem(item_id) {
    let cartUrl = 'carts/mine';
    if (!this.auth.isLogin()) {
      cartUrl = 'guest-carts/' + this.guestCardId;
    }
    return this.rest.deleteItem(item_id, cartUrl + '/items/' + item_id);
  }
}
