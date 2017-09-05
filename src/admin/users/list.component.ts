import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService, PagerService, RestService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class UsersListComponent implements OnInit {
    public users:any;
    public pager: any;
    searchForm;
    searchSubscripe;
    loadingList;
    initLoad;
    deleteItems;

    constructor(private usersService: UsersService, 
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
            .subscribe(values => this.loadUsersList(1));

        this.loadUsersList();
    }
    
    loadUsersList(pageNo?) {
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
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, "customers/search").subscribe(users => {
            this.initLoad = false;
            this.loadingList = false;
            this.initUsersList(users, pageNo);
        });        
    }
    
    initUsersList(users, page?) {
        this.users = users.items;
        for (let user of this.users){
            user.default_shipping = user.addresses.find(x => x.default_shipping == 1);
            user.default_billing = user.addresses.find(x => x.default_shipping == 1);
        }
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(users.total_count, page, pageSize);
    }

    abortSearch() {
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadUsersList(page);
    }
    
    isDeleted(userId) {
        return this.deleteItems.findIndex(item => item.id == userId) !== -1;
    }

    cancelDelete(userId) {
        let i = this.deleteItems.findIndex(item => item.id == userId);
        this.deleteItems[i].subscribe.unsubscribe();
        this.deleteItems.splice(i,1);
    }
    
    deleteUser(userId) {
        if(!confirm("Are you sure to delete the customer?")) {
            return;
        }
        this.alert.clear();
        let deleteSubscribe = this.rest.deleteItem(userId, 'customers/'+userId).subscribe(data => {
            if(data) {                
                this.deleteItems = this.deleteItems.filter(item => item.id != userId);
                this.users = this.users.filter(item => item.id != userId);
                if(this.deleteItems.length == 0) {
                    this.alert.success("The customers deleted successfully!", true);
                    this.initLoad = true;
                    this.loadUsersList(this.pager.currentPage);
                }
            } else {
                this.deleteItems = this.deleteItems.filter(item => item.id != userId);
            }
        }, error => {
            this.deleteItems = this.deleteItems.filter(item => item.id != userId);
        });
        let deleteItem = {
            id : userId,
            subscribe : deleteSubscribe
        };
        this.deleteItems.push(deleteItem);
    }
}
