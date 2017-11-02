import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
    cart;
    totals;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');

        this.rest.getItem('', 'carts/mine').subscribe(res => {
            this.cart = res;
        });

        this.rest.getItem('', 'carts/mine/totals').subscribe(res => {
            this.totals = res;
        });
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
