import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class NewslettersListComponent implements OnInit {
    newsletters:any;
    pager: any;
    searchForm;
    searchSubscripe;
    loadingList;
    initLoad;

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
            subscriber_email : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadNewslettersList(1));
        this.loadNewslettersList(1);
    }

    getStatusText(status) {
        if(status == 1) return "Subscribed";
        if(status == 2) return "Not Activated";
        if(status == 3) return "Unsubscribed";
        if(status == 4) return "Unconfirmed";    
    }

    initNewslettersList(newsletters, page?) {
        this.newsletters = newsletters.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(newsletters.total_count, page, pageSize);        
    }

    loadNewslettersList(pageNo?) {
        let searchValues = this.searchForm.value;
        let filters = [];
        if(searchValues && searchValues.subscriber_email) {
            let searchNameFilter = {
                filters : [{
                    field : "subscriber_email",
                    value : "%" + searchValues.subscriber_email + "%",
                    condition_type : 'like'
                }]
            };
            filters.push(searchNameFilter);
        }
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(1, filters, pageSize, 'newsletter/search', 'criteria')
            .subscribe(newsletters => {
            this.initLoad = false;
            this.loadingList = false;
            this.initNewslettersList(newsletters, pageNo);
        });        
    }

    abortSearch() {
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadNewslettersList(page);
    }

    deleteNewsletter(newsletterId) {
        if(!confirm("Are you sure to delete the newsletter?")) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem(newsletterId, 'newsletter/' + newsletterId).subscribe(data => {
            if(data) {
                this.alert.success("The newsletter deleted successfully!", true);
                this.loadNewslettersList(1);
            } else {
                this.alert.error("The newsletter can't be deleted!", true);
            }
        });
    }
}
