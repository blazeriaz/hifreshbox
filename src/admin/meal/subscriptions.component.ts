import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService, AlertService, RestService, MealMenuService} from 'services';
import { FormBuilder } from '@angular/forms';
import * as GlobalVariable from 'global';
export const pageSize = 10;

@Component({
    templateUrl: 'subscriptions.component.html'
})
export class SubscriptionListComponent implements OnInit, OnDestroy {
    subscriptions: any = [];
    selectedSubscriptions: any;
    pager: any;
    yearMonthSubs;
    yearWeek;
    listSubscription;

    constructor(private router: Router,
                private rest: RestService,
                private alert: AlertService,
                private _fb: FormBuilder,
                private pagerService: PagerService,
                private mealMenuService: MealMenuService) {
    }

    ngOnInit(): void {
        this.yearMonthSubs = this.mealMenuService.getYearWeek().subscribe(data => {
            if(this.listSubscription) {
                this.listSubscription.unsubscribe();
            }
            const date = new Date();
            const currentWeek = this.mealMenuService.getWeekNumber(date);
            if (date.getDay() <= 5 && data.week < currentWeek + 2) {
                // this.router.navigate(['menu']);
            }
            if(date.getDay() > 5 && data.week <= currentWeek + 2) {
                // this.router.navigate(['menu']);
            }
            this.yearWeek = data;
            this.loadSubscriptionsList(1);
        });
    }

    ngOnDestroy() {
        this.yearMonthSubs.unsubscribe();
        this.listSubscription.unsubscribe();
    }

    loadSubscriptionsList(pageNo?) {
        const filters = [];
        filters.push({
            filters : [{
                field : 'week_no',
                value : this.yearWeek.week,
                condition_type : 'eq'
            }]
        });

        const sortOrders = [{
            field: 'creation_time',
            direction: 'DESC'
        }];

        this.listSubscription = this.rest.getItems(pageNo, filters, pageSize, 'weekly/orders', 'criteria', sortOrders).subscribe(subscriptions => {
            this.initSubscriptionsList(subscriptions, pageNo);
        });
    }

    initSubscriptionsList(subscriptions, page?) {
        this.subscriptions = subscriptions.items;
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(subscriptions.total_count, page, pageSize);
    }

    setPage(page) {
        this.loadSubscriptionsList(page);
    }

    goToBack() {
        this.router.navigate(['/', 'meal', 'menu']);
    }

    exportMenuSub() {
        let url = GlobalVariable.EXPORT_MEAL_SUB + "?week_no=" + this.yearWeek.week +  '&' + 'year=' + this.yearWeek.year
        window.open(url, '_blank');
    }
}
