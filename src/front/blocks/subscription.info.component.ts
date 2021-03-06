import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RestService, AlertService, CartService } from 'services';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'subscription_info',
    templateUrl: 'subscription.info.component.html'
})
export class SubscriptionInfoComponent implements OnInit, OnDestroy {
    orderSubscription;
    loading;
    needToUnsubscribe = [];
    minDate;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private cartService: CartService,
        private router: Router,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.minDate = new Date();
        this.loading = true;    
        this.needToUnsubscribe.push(this.cartService.getCartTotal().subscribe(data => {
            this.orderSubscription = null;
            if(data.subscription && data.subscription.has_subscription) {
                this.orderSubscription = data.subscription;
                if (data.subscription.blocked_week_start && data.subscription.blocked_week_end) {
                    const s = new Date(data.subscription.blocked_week_start);
                    const e = new Date(data.subscription.blocked_week_end);
                    this.orderSubscription.blocked = [s, e];
                }
            }            
            this.loading = false;
        }));
    }
    
    addMealToCart() {
        this.alert.clear();
        this.router.navigate(['/', 'menu']);
    }

    modifyBlockDates() {
        if(!confirm("Are you sure want to block the selected dates for meal order?")) {
            return false;
        }
        const sendData = {
            week: {
                week_no: this.orderSubscription.week_no,
                year: this.orderSubscription.year,
                user_id: this.orderSubscription.user_id,
                start_date: this.datePipe.transform(this.orderSubscription.blocked[0], 'short'),
                end_date: this.datePipe.transform(this.orderSubscription.blocked[1], 'short'),
            }
        };
        this.loading = true;
        this.needToUnsubscribe.push(this.rest.saveItem(false, sendData, 'subscription/pause').subscribe(r => {
            this.cartService.initUserSubscription();
            this.loading = false;
            this.alert.success("The blocked dates for meal order had been updated successfully");
        }));
    }

    cancelSub(w, y) {
        if(!confirm("Are you sure want to cancel the upcoming meal order?")) {
            return false;
        }
        const sendData = {
            week: {
                week_no: w,
                year: y,
                user_id: this.orderSubscription.user_id
            }
        };
        this.loading = true;
        this.needToUnsubscribe.push(this.rest.saveItem(false, sendData, 'subscription/pause').subscribe(r => {
            this.cartService.initUserSubscription();
            this.alert.success("The upcoming meal order had been cancelled successfully");
        }));
    }

    retriveSub(id) {
        this.rest.deleteItem('', 'subscription/resumesubscription/' + id).subscribe(r => {
            this.cartService.initUserSubscription();
            this.alert.success("The upcoming meal order had been retreived successfully");
        });
    }

    unSubscribe() {
        if(!confirm("Are you sure want to unsubscripe the meal order?")) {
            return false;
        }
        this.loading = true;
        this.needToUnsubscribe.push(
            this.rest.getItem(1, 'un-subscribe-meal/' + this.orderSubscription.subscription_id).subscribe(r => {
                this.cartService.initUserSubscription();
                this.alert.success("The meal order had been unsubscribed successfully");
            })
        );
    }

    ngOnDestroy() {
        this.needToUnsubscribe.forEach(x => x.unsubscribe());
    }
}
