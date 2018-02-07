import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService } from "services";
import * as GlobalVariable from 'global';
import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class OrdersListComponent implements OnInit {
    public orders: any;
    public pager: any;
    searchForm;
    searchSubscripe;
    loadingList;
    initLoad;
    deleteItems;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private pagerService: PagerService,
        public route: ActivatedRoute,
        public router: Router,
        private _fb: FormBuilder ) { }

    ngOnInit(): void {
        this.initLoad = true;
        this.deleteItems = [];
        this.searchForm = this._fb.group({
            name : ''
        });

        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadOrdersList(1));

        this.loadOrdersList();
    }

    loadOrdersList(pageNo?) {
        const filters = [];
        const searchValues = this.searchForm.value;
        if (searchValues && searchValues.name) {
            filters.push({
                filters : [{
                    field : 'name',
                    value : '%' + searchValues.name + '%',
                    condition_type : 'like'
                }]
            });
        }
        if (this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
        const sortOrders = [{
            field: 'created_at',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, 'orders', false, sortOrders).subscribe(orders => {
            this.initLoad = false;
            this.loadingList = false;
            this.initOrdersList(orders, pageNo);
        });
    }

    initOrdersList(orders, page?) {
        this.orders = orders.items.map(x => {
            x.pdf_url = GlobalVariable.ORDER_PDF_URL + x.entity_id;
            return x;
        });
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(orders.total_count, page, pageSize);
    }

    abortSearch() {
        // tslint:disable-next-line:no-unused-expression
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadOrdersList(page);
    }
}
