import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService, CartService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'checkout.component.html'
})
export class CheckoutComponent implements OnInit, OnDestroy {
    cart;
    totals;
    steps;
    step;

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

        this.rest.getItem('', 'carts/mine').subscribe(res => {
            this.cart = res;
        });

        this.rest.getItem('', 'carts/mine/totals').subscribe(res => {
            this.totals = res;
        });

        this.steps = [{
            key: 'login',
            title: 'Login'
        }, {
            key: 'address',
            title: 'Address'
        }, {
            key: 'meal',
            title: 'Meal preference'
        }, {
            key: 'payment',
            title: 'Payment Info'
        }, {
            key: 'confirm',
            title: 'Order Summery'
        }];

        this.step = 'address';
    }

    goBack(step) {
        const index = this.steps.findIndex(x => x.key === step);
        if (index <= 0) {
            this.router.navigate(['/', 'cart']);
        } else {
            this.step = this.steps[index - 1].key;
        }
        window.scroll(0, 0);
    }

    goNext(step) {
        const index = this.steps.findIndex(x => x.key === step);
        if (index === -1) {
            this.router.navigate(['/', 'cart']);
        }
        if (index > this.steps.length) {
            this.router.navigate(['/', 'checkout-success']);
        } else {
            this.step = this.steps[index + 1].key;
        }
        window.scroll(0, 0);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
