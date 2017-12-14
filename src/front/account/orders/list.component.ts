import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService, CartService, MealMenuService } from 'services';

import { FormBuilder, Validators, FormArray } from '@angular/forms';

export const pageSize = 5;

@Component({
    templateUrl: 'list.component.html'
})
export class OrdersListComponent implements OnInit {
    public orders: any;
    public pager: any;
    subscriptions = [];
    pagerSub;
    orderSubscription;
    loadingList;
    loadingSubList;
    needToUnsubscribe = [];

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private pagerService: PagerService,
        private cartService: CartService,
        private mealMenuService: MealMenuService,
        public route: ActivatedRoute,
        public router: Router,
        private _fb: FormBuilder ) { }

    ngOnInit(): void {
        this.loadOrdersList();        
        this.loadingSubList = true;
        this.needToUnsubscribe.push(this.cartService.getCartTotal().subscribe(data => {
            if(data.subscription) {
                this.orderSubscription = data.subscription;
                this.loadSubscriptionList(1);
            }
        }));
    }

    ngOnDestroy() {
        this.needToUnsubscribe.forEach(x => x.unsubscribe());
    }

    loadOrdersList(pageNo?) {
        const filters = [];
        const sortOrders = [{
            field: 'created_at',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.needToUnsubscribe.push(
            this.rest.getItems(pageNo, filters, pageSize, 'custom-order', 'criteria', sortOrders)
                .subscribe(orders => {
                    this.loadingList = false;
                    this.initOrdersList(orders, pageNo);
            })
        );
    }

    initOrdersList(orders, page?) {
        this.orders = orders[0].map(x => {
            x.displayTotal = x.total_paid ? x.total_paid : x.total_due;
            return x;
        });;
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(orders[3].total_record, page, pageSize);
    }

    setPage(page) {
        this.loadOrdersList(page);
    }

    loadSubscriptionList(pageNo?) {
        const filters = [];
        const sortOrders = [{
            field: 'created_at',
            direction: 'DESC'
        }];
        this.loadingSubList = true;
        this.needToUnsubscribe.push(
            this.rest.getItems(pageNo, filters, pageSize, 'list/my-subscription-orders', 'criteria', sortOrders)
                .subscribe(subs => {
                    this.loadingSubList = false;
                    this.initSubscriptionList(subs, pageNo);
            })
        );
    }

    initSubscriptionList(subs, page?) {
        this.subscriptions = subs[0].map(x => {
            x.weekDate = this.mealMenuService.getDateOfISOWeekString(x.week_no, x.year);
            return x;
        });
        // get pager object from service
        page = page ? page : 1;
        this.pagerSub = this.pagerService.getPager(subs[3].total_record, page, pageSize);
    }

    setSubscriptionPage(page) {
        this.loadSubscriptionList(page);
    }
}
