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
    loading;

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
        this.cartService.getCartTotal().subscribe(data => {
            if (!data.cart) {
                return;
            }
            this.cart = data.cart;
            this.showImages = data.showImages;
            this.mealCartItem = data.mealCartItem;
            this.totals = data.totals;
            this.billingAddress = data.billingAddress;
            this.shippingAddress = data.shippingAddress;
            this.showCartItems = false;
            if (this.mealCartItem && this.cart && this.cart.items_count > 1) {
                this.showCartItems = true;
            }
        });
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
        const sendData = {paymentMethod : {
            method: 'cashondelivery'
        }};
        this.loading = true;
        this.rest.saveItem(false, sendData, 'carts/mine/payment-information').subscribe(res => {
            this.next.emit('confirm');
        }, e => {
            const err = e.json();
            this.loading = false;
            this.alert.error(err.message);
        })
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
