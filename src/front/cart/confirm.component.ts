import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService, CartService } from 'services';

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

    cart;
    totals;
    showImages;
    billingAddress;
    shippingAddress;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private _fb: FormBuilder,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');

        this.cartService.setCartTotal();
        this.cartService.getCartTotal().subscribe(data => {
            this.cart = data.cart;
            this.showImages = data.showImages;
            this.totals = data.totals;
            this.billingAddress = data.cart.billing_address;
            this.shippingAddress = data.cart.extension_attributes.shipping_assignments[0].shipping.address;
        });
    }

    goBack() {
        this.back.emit('confirm');
    }

    confirmOrder() {
        const sendData = {paymentMethod : {
            method: 'cashondelivery'
        }};
        this.rest.saveItem(false, sendData, 'carts/mine/payment-information').subscribe(res => {
            this.next.emit('confirm');
        })
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
