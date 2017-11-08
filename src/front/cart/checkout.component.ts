import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService, CartService, AuthService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'checkout.component.html'
})
export class CheckoutComponent implements OnInit, OnDestroy {
    cart;
    totals;
    steps;
    currentStep;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private auth: AuthService,
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
            title: 'Login',
        }, {
            key: 'meal',
            title: 'Meal preference'
        }, {
            key: 'address',
            title: 'Address'
        }, {
            key: 'payment',
            title: 'Payment Info'
        }, {
            key: 'confirm',
            title: 'Order Summery'
        }];

        this.currentStep = 'login';

        if (!this.cartService.mealAdded) {
            this.steps = this.steps.filter(x => x.key !== 'meal');
        }

        if (this.auth.isLogin()) {
            this.goNext('login');
        }
    }

    goBack(step) {
        const index = this.steps.findIndex(x => x.key === step);
        delete this.steps[index].complete;
        if (index <= 0) {
            this.router.navigate(['/', 'cart']);
        } else {
            const stepObj = this.steps[index - 1];
            this.currentStep = stepObj.key;
        }
        window.scroll(0, 0);
    }

    goNext(step) {
        const index = this.steps.findIndex(x => x.key === step);
        if (index === -1) {
            this.router.navigate(['/', 'cart']);
        }
        const stepObj = this.steps[index + 1];
        if (stepObj && stepObj.key) {
            this.steps[index].complete = 1;
            this.currentStep = stepObj.key;
        } else {
            this.router.navigate(['/', 'checkout-success']);
        }
        window.scroll(0, 0);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
