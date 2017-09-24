import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { RestService, AlertService, PagerService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class FaqListComponent implements OnInit {
    faq:any;
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
        this.searchForm = this._fb.group({
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadFaqList(1));
        this.loadFaqList(1);
    }
    
    loadFaqList(pageNo?) {
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
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, "faqs/search",'criteria').subscribe(faq => {
            this.initLoad = false;
            this.loadingList = false;
            this.initFaqList(faq, pageNo);
        });        
    }
    
    initFaqList(faq, page?) {
        this.faq = faq.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(faq.total_count, page, pageSize);  
        console.log(this.faq);      
    }
    
    abortSearch() {
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadFaqList(page);
    }
    
    isDeleted(id) {
        return this.deleteItems.findIndex(item => item.id == id) !== -1;
    }

    cancelDelete(id) {
        let i = this.deleteItems.findIndex(item => item.id == id);
        this.deleteItems[i].subscribe.unsubscribe();
        this.deleteItems.splice(i,1);
    }
    
    deleteFaq(id) {
        if(!confirm("Are you sure to delete the faq?")) {
            return;
        }
        this.alert.clear();
        let deleteSubscribe = this.rest.deleteItem(id, 'faqs/'+id).subscribe(data => {
            if(data) {                
                this.deleteItems = this.deleteItems.filter(item => item.id != id);
                this.faq = this.faq.filter(item => item.id != id);
                if(this.deleteItems.length == 0) {
                    this.alert.success("The faq deleted successfully!", true);
                    this.initLoad = true;
                    this.loadFaqList(this.pager.currentPage); 
                }
            } else {
                this.deleteItems = this.deleteItems.filter(item => item.id != id);
            }
        }, error => {
            this.deleteItems = this.deleteItems.filter(item => item.id != id);
        });
        let deleteItem = {
            id : id,
            subscribe : deleteSubscribe
        };
        this.deleteItems.push(deleteItem);
    }
}
