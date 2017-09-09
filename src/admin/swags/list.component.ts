import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { RestService, AlertService, PagerService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class SwagsListComponent implements OnInit {
    swags:any;
    pager: any;
    searchForm;
    searchSubscripe;
    loadingList;
    initLoad;
    deleteItems;

    constructor(private rest: RestService,
                private alert: AlertService,
                private pagerService: PagerService,
                private route: ActivatedRoute,
                private router: Router,
                private _fb : FormBuilder ) {
    }

    ngOnInit(): void {
        this.initLoad = true;
        this.deleteItems = [];
        this.searchForm = this._fb.group({
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadSwagsList(1));
        this.loadSwagsList(1);
    }
    
    loadSwagsList(pageNo?) {
        let filters = [];
        let iniFilter = {
            filters : [{
                field : "attribute_set_id",
                value : 17,
                condition_type : 'eq'
            }]
        };
        filters.push(iniFilter);

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
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, "products").subscribe(swags => {
            this.initLoad = false;
            this.loadingList = false;
            this.initSwagsList(swags, pageNo);
        });        
    }
    
    initSwagsList(swags, page?) {
        this.swags = swags.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(swags.total_count, page, pageSize);        
    }
    
    abortSearch() {
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadSwagsList(page);
    }
    
    isDeleted(sku) {
        return this.deleteItems.findIndex(item => item.sku == sku) !== -1;
    }

    cancelDelete(sku) {
        let i = this.deleteItems.findIndex(item => item.sku == sku);
        this.deleteItems[i].subscribe.unsubscribe();
        this.deleteItems.splice(i,1);
    }
    
    deleteSwag(swagSku) {
        if(!confirm("Are you sure to delete the swag?")) {
            return;
        }
        this.alert.clear();
        let deleteSubscribe = this.rest.deleteItem(swagSku, 'products/'+swagSku).subscribe(data => {
            if(data) {                
                this.deleteItems = this.deleteItems.filter(item => item.sku != swagSku);
                this.swags = this.swags.filter(item => item.sku != swagSku);
                if(this.deleteItems.length == 0) {
                    this.alert.success("The swags deleted successfully!", true);
                    this.initLoad = true;
                    this.loadSwagsList(this.pager.currentPage); 
                }
            } else {
                this.deleteItems = this.deleteItems.filter(item => item.sku != swagSku);
            }
        }, error => {
            this.deleteItems = this.deleteItems.filter(item => item.sku != swagSku);
        });
        let deleteItem = {
            sku : swagSku,
            subscribe : deleteSubscribe
        };
        this.deleteItems.push(deleteItem);
    }
}
