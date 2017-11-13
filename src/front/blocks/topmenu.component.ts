import { Component, OnInit, OnDestroy } from '@angular/core';

import * as GlobalVariable from 'global';
import { AuthService, RestService, CartService } from 'services';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'topmenu',
    templateUrl: 'topmenu.component.html'
})
export class TopmenuComponent implements OnInit {
    cart = null;
    constructor(
        private auth: AuthService,
        private rest: RestService,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.cartService.getCartTotal().subscribe(data => {
            if (data.cart) {
                this.cart = data.cart;
            }
        });
    }

    islogin() {
        return this.auth.isLogin();
    }
}
