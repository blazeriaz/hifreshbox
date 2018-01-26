import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from 'services/cart.service';

@Component({
  templateUrl: 'cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
    cart;
    totals;
    showImages;
    needToDestroyEvents = [];

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.initCartPage();
    }

    initCartPage() {
        this.needToDestroyEvents.push(this.cartService.getCartTotal().subscribe(data => {
            if (data.cart || data.totals) {
                this.cart = data.cart;
                this.showImages = data.showImages;
                this.totals = data.totals;
            }
        }))
    }

    getImageFromCart(item_id) {
        const item = this.cart.items.filter(x => x.item_id === item_id);
        return item.length > 0 ? item[0].extension_attributes.image_url : '';
    }

    getFromCartTotal(item_id, key) {
        const item = this.totals.items.filter(x => x.item_id === item_id);
        return item.length > 0 ? item[0][key] : null;
    }

    removeCartItem(item_id) {
        if (!confirm('Are you sure want remove item from cart?')) {
            return;
        }
        this.rest.showLoader();
        this.cartService.removeCartItem(item_id).subscribe(res => {
            this.rest.hideLoader();
            this.cartService.decreaseCartItem(item_id);
        });
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
