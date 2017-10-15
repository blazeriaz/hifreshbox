import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService, PagerService, RestService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class PagesListComponent implements OnInit {
    public orders:any;
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
        private _fb : FormBuilder ) { }
    
    ngOnInit(): void {
        this.initLoad = true;
        this.deleteItems = [];
        this.searchForm = this._fb.group({
            name : ''
        });

        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadPagesList(1));

        this.loadPagesList();
    }
    
    loadPagesList(pageNo?) {
        let filters = [];
        let searchValues = this.searchForm.value;
        if(searchValues && searchValues.name) {
            let searchNameFilter = {
                filters : [{
                    field : "name",
                    value : "%" + searchValues.name + "%",
                    condition_type : 'like'
                }]
            };
            filters.push(searchNameFilter);
        }
        if(this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, "orders").subscribe(orders => {
            this.initLoad = false;
            this.loadingList = false;
            this.initOrdersList(orders, pageNo);
        });        
    }
    
    initOrdersList(orders, page?) {
        this.orders = orders.items;
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(orders.total_count, page, pageSize);
    }

    abortSearch() {
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadPagesList(page);
    }
    
    isDeleted(orderId) {
        return this.deleteItems.findIndex(item => item.id == orderId) !== -1;
    }

    cancelDelete(orderId) {
        let i = this.deleteItems.findIndex(item => item.id == orderId);
        this.deleteItems[i].subscribe.unsubscribe();
        this.deleteItems.splice(i,1);
    }
    
    deleteOrder(orderId) {
        if(!confirm("Are you sure to delete the customer?")) {
            return;
        }
        this.alert.clear();
        let deleteSubscribe = this.rest.deleteItem(orderId, 'customers/'+orderId).subscribe(data => {
            if(data) {                
                this.deleteItems = this.deleteItems.filter(item => item.id != orderId);
                this.orders = this.orders.filter(item => item.id != orderId);
                if(this.deleteItems.length == 0) {
                    this.alert.success("The customers deleted successfully!", true);
                    this.initLoad = true;
                    this.loadPagesList(this.pager.currentPage);
                }
            } else {
                this.deleteItems = this.deleteItems.filter(item => item.id != orderId);
            }
        }, error => {
            this.deleteItems = this.deleteItems.filter(item => item.id != orderId);
        });
        let deleteItem = {
            id : orderId,
            subscribe : deleteSubscribe
        };
        this.deleteItems.push(deleteItem);
    }
}
