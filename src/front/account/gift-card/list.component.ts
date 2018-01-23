import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService, AuthService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CreditCardValidator } from 'angular-cc-library';
import { error } from 'selenium-webdriver';

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class GiftCardsListComponent implements OnInit {
    public GiftCards: any = [];
    public pager: any;
    searchForm;
    searchSubscripe;
    loadingList;
    initLoad;
    deleteItems;
    modalRef: BsModalRef;
    userPaymentForm;
    userPaymentSubmitted;
    user;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private pagerService: PagerService,
        public route: ActivatedRoute,
        public router: Router,
        private modalService: BsModalService,
        private auth: AuthService,
        private _fb: FormBuilder ) { }

    ngOnInit(): void {
        this.deleteItems = [];
        this.loadGiftCardsList(1);
    }

    loadGiftCardsList(pageNo) {
        let filters = [];

        filters.push({
            filters : [{
                field : "action",
                value : "credit",
                condition_type : 'Equals'
            }]
        });

        const sortOrders = [{
            field: 'transaction_at',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, 'wallet/mycredits', 'criteria').subscribe(GiftCards => {
            this.loadingList = false;
            this.initGiftCardsList(GiftCards, pageNo);
        }, e => {
            this.loadingList = false;   
            this.alert.error("Server Error: Can't fetch data from server!");         
        });
    }

    initGiftCardsList(GiftCards, page?) {
        this.GiftCards = GiftCards.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(GiftCards.total_count, page, pageSize);        
    }

    setPage(page) {
        this.loadGiftCardsList(page);
    }
}
