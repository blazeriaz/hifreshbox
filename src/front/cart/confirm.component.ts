import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService, CartService, MealMenuService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'checkout-confirm',
    templateUrl: 'confirm.component.html'
})
export class ConfirmComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();
    @Output() goStep = new EventEmitter();

    cart;
    totals;
    showImages;
    mealCartItem;
    billingAddress;
    shippingAddress;
    currentMenuDays;
    showCartItems;
    mealPreferences;
    loading;
    additional_info;
    needToDestroyEvents = [];

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private _fb: FormBuilder,
        private cartService: CartService,
        private mealMenuService: MealMenuService
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.loading = false;       
        this.rest.showLoader(); 
        this.needToDestroyEvents.push(this.cartService.getCartTotal().subscribe(data => {
            this.rest.showLoader();
            if (!data.cart || !data.cart.loading) {
                return;
            }
            this.cart = data.cart;
            this.showImages = data.showImages;
            this.mealCartItem = data.mealCartItem;
            this.totals = data.totals;
            this.billingAddress = data.billingAddress;
            this.shippingAddress = data.shippingAddress;
            this.showCartItems = true;
            if (this.mealCartItem && this.cart && this.cart.items_count === 1) {
                this.showCartItems = false;
            }
            this.mealPreferences = {};
            if (data.mealPreferences && data.mealPreferences.length > 0) {
                data.mealPreferences.forEach((x, i) => {
                    if (i === 0) {
                        const selected_options = [];
                        x.forEach(y => {
                            y.options.forEach(z => {
                                if (z.is_selected) {
                                    selected_options.push(z);
                                }
                            });
                        });
                        this.mealPreferences = Object.assign({}, this.mealPreferences, {selected_options: selected_options});
                    } else {
                        this.mealPreferences = Object.assign({}, this.mealPreferences, x);
                    }
                });
            }
            this.rest.hideLoader();
        }))
        setTimeout(() => this.cartService.setCartTotal(true), 200);

        this.currentMenuDays = this.mealMenuService.getCurrentMenuDays();
    }

    goBack() {
        this.back.emit('confirm');
    }

    goCheckoutStep(step) {
        this.goStep.emit(step);
    }

    confirmOrder() {
        const billingAddress = this.billingAddress;
        delete billingAddress.id;
        const sendData = {
            paymentMethod : {
                method: 'braintree_cc_vault',
                additional_data: this.cartService.getPaymentInfo()
            },
            billing_address: billingAddress
        };
        this.loading = true;
        this.rest.showLoader();
        this.rest.saveItem(false, sendData, 'carts/mine/payment-information').subscribe(order_id => {
            if(this.additional_info) {
                const sendData = {
                    order_comments: {
                        order_id: order_id,
                        message: this.additional_info
                    }
                };
                this.rest.saveItem(false, sendData, 'order/comments-add').subscribe(x => {
                });
            }  
            this.rest.hideLoader();          
            this.next.emit('confirm');
            this.rest.saveItem(false, [], 'carts/mine').subscribe(x => {
                this.cartService.setCartTotal(true);
            });
        }, e => {
            this.rest.hideLoader();    
            const err = e.json();
            this.loading = false;
            this.alert.error(err.message);
        })
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
