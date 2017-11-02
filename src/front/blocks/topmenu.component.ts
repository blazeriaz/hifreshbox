import { Component, OnInit, OnDestroy } from '@angular/core';

import * as GlobalVariable from 'global';
import { AuthService, RestService } from 'services';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'topmenu',
    templateUrl: 'topmenu.component.html'
})
export class TopmenuComponent implements OnInit {
    cart = null;
    constructor(
        private auth: AuthService,
        private rest: RestService
    ) { }

    ngOnInit(): void {
        this.rest.getItem('', 'carts/mine').subscribe(res => {
            this.cart = res;
        });
    }

    islogin() {
        return this.auth.isLogin();
    }
}
