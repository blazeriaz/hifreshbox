import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class ReviewsListComponent implements OnInit {
    reviews:any;
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
            nickname : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadReviewsList(1));
        this.loadReviewsList(1);
    }

    getReviewStatus(status) {
        if(status == 1) return "Approved";
        if(status == 2) return "Pending";
        if(status == 3) return "Not Approved";
    }

    initReviewsList(reviews, page?) {
        this.reviews = reviews.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(reviews.total_count, page, pageSize);        
    }

    loadReviewsList(pageNo?) {
        let searchValues = this.searchForm.value;
        let filters = [];
        if(searchValues && searchValues.nickname) {
            let searchNameFilter1 = {
                filters : [{
                    field : "nickname",
                    value : "%" + searchValues.nickname + "%",
                    condition_type : 'like'
                }]
            };
            filters.push(searchNameFilter1);
            let searchNameFilter2 = {
                filters : [{
                    field : "title",
                    value : "%" + searchValues.nickname + "%",
                    condition_type : 'like'
                }]
            };
            filters.push(searchNameFilter2);
        }
        this.loadingList = true;
        const sortOrders = [{
            field: 'review_id',
            direction: 'DESC'
        }];
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, 'review/search', 'criteria', sortOrders)
            .subscribe(reviews => {
            this.initLoad = false;
            this.loadingList = false;
            this.initReviewsList(reviews, pageNo);
        });        
    }

    abortSearch() {
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadReviewsList(page);
    }

    deleteReview(reviewId) {
        if(!confirm("Are you sure to delete the review?")) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem(reviewId, 'review/' + reviewId).subscribe(data => {
            if(data) {
                this.alert.success("The review deleted successfully!", true);
                this.loadReviewsList(1);
            } else {
                this.alert.error("The review can't be deleted!", true);
            }
        });
    }
}
