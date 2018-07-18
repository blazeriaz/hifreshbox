import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService, CartService, MealMenuService, AuthService } from 'services';
import * as GlobalVariable from 'global';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

export const pageSize = 5;

@Component({
    templateUrl: 'list.component.html'
})
export class OrdersListComponent implements OnInit {
    @ViewChild('rateSubscription') rateSubscription: TemplateRef<any>;

    modalRef: BsModalRef;
    public orders: any;
    public pager: any;
    subscriptions = [];
    pagerSub;
    orderSubscription;
    loadingList;
    loadingSubList;
    needToDestroyEvents = [];
    feedBackSub;
    feedBackForm;
    userData;
    sentData;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private pagerService: PagerService,
        private auth: AuthService,
        private cartService: CartService,
        private mealMenuService: MealMenuService,
        public route: ActivatedRoute,
        private modalService: BsModalService,
        public router: Router,
        private _fb: FormBuilder ) { }

    ngOnInit(): void {
        this.loadOrdersList();        
        this.loadingSubList = true;
        this.needToDestroyEvents.push(this.cartService.getCartTotal().subscribe(data => {
            if(data.subscription && data.subscription.has_subscription) {
                this.orderSubscription = data.subscription;
                this.loadSubscriptionList(1);
            } else {
                this.loadingSubList = false;
            }
        }));

        this.needToDestroyEvents.push(this.auth.getUserInfo().subscribe(user => {            
            if(user && user.loading) {
                return;
            }
            if (!user) {
                this.auth.initLoggedInUserInfo();
                return;
            }
            this.userData = user;
        }))
    }

    ngOnDestroy() {
        this.needToDestroyEvents.forEach(x => x.unsubscribe());
    }

    addProductRatingField(prod) {
        return this._fb.group({
            productId: prod.entity_id,
            nickname: this.userData.firstname + ' ' + this.userData.lastname,
            title: 'Week ' +  this.feedBackSub.week_no + ' - ' + this.feedBackSub.weekDate+ ', ' + this.feedBackSub.year + ': ' + prod.name,
            detail: ['', Validators.required],
            customerId: this.userData.id,
            ratingValue: prod.week_rating  ? prod.week_rating : 0,
            storeId: 1,
            weekNo: this.feedBackSub.week_no,
            year: this.feedBackSub.year
        })
    }

    openFeedbackForm(sub) {
        this.feedBackSub = sub;        
        this.feedBackForm = this._fb.group({
            'reviews' : this._fb.array([])
        });
        this.feedBackSub.product_list.forEach(prod => {
            this.feedBackForm.controls['reviews'].push(this.addProductRatingField(prod));
        });
        this.modalRef = this.modalService.show(this.rateSubscription, {
            animated: true,
            keyboard: false,
            backdrop: true,
            ignoreBackdropClick: true
        });
    }

    setSubProductRate(index, rate) {
        if(this.feedBackSub.ratedOrder) {
            return;
        }
        let prod = this.feedBackSub.product_list[index];
        prod.week_rating = rate;
        this.feedBackForm.controls['reviews'].controls[index].patchValue({
            ratingValue: (rate / 20)
        });
    }

    ratingStarClass(index, rate) {
        let prod = this.feedBackSub.product_list[index];
        if(prod && prod.week_rating && rate <= prod.week_rating) {
            return 'text-success';
        }
    }

    saveMenuFeedBack() {
        this.alert.clear();
        this.sentData = true;
        if (this.feedBackForm.valid) {
            this.rest.saveItem(false, this.feedBackForm.value, 'review/custom/post').subscribe(data => {
                this.modalRef.hide();
                this.sentData = false;
                this.alert.success('Feedback given succesfully for the menu!');
                this.loadSubscriptionList(this.pagerSub.currentPage);
            }, e => {
                const err = e.json();
                this.alert.error(err.message, false , 'popup');
                this.sentData = false;
            });
        } else {
            this.alert.error('Please give a feedback for all meals', false , 'popup');
        }
    }

    loadOrdersList(pageNo?) {
        const filters = [];
        const sortOrders = [{
            field: 'created_at',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.orders = [];
        this.needToDestroyEvents.push(
            this.rest.getItems(pageNo, filters, pageSize, 'custom-order', 'criteria', sortOrders)
                .subscribe(orders => {
                    this.loadingList = false;
                    this.initOrdersList(orders, pageNo);
            }, e => {
                this.loadingList = false;
            })
        );
    }

    initOrdersList(orders, page?) {
        this.orders = orders[0].map(x => {
            x.displayTotal = x.total_paid ? x.total_paid : x.total_due;
            x.pdf_url = GlobalVariable.ORDER_PDF_URL + x.entity_id;
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
        this.needToDestroyEvents.push(
            this.rest.getItems(pageNo, filters, pageSize, 'list/my-subscription-orders', 'criteria', sortOrders)
                .subscribe(subs => {
                    this.loadingSubList = false;
                    this.initSubscriptionList(subs, pageNo);
            }, e=> {
                this.loadingSubList = false;
            })
        );
    }

    initSubscriptionList(subs, page?) {
        this.subscriptions = subs[0].map(x => {
            x.weekDate = this.mealMenuService.getDateOfISOWeekString(x.week_no, x.year);
            x.ratedOrder = false;
            x.product_list.forEach((p) => {
                if(p.week_rating) {
                    x.ratedOrder = true;
                }
            });
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
