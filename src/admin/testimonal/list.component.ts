import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class TestimonalListComponent implements OnInit {
    testimonals:any;
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
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadTestimonalList(1));
        this.loadTestimonalList(1);
    }

    getTestimonalStatus(status) {
        if(status == 1) return "Approved";
        if(status == 2) return "Pending";
        if(status == 3) return "Not Approved";
    }

    initTestimonalList(testimonal, page?) {
        this.testimonals = testimonal.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(testimonal.total_count, page, pageSize);     
    }

    loadTestimonalList(pageNo?) {
        let searchValues = this.searchForm.value;
        let filters = [];
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
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(1, filters, pageSize, 'testimonials/search', 'criteria')
            .subscribe(testimonals => {
            this.initLoad = false;
            this.loadingList = false;
            this.initTestimonalList(testimonals, pageNo);
        });        
    }

    abortSearch() {
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadTestimonalList(page);
    }

    deleteTestimonial(testimonialId) {
        if(!confirm("Are you sure to delete the testimonial?")) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem(testimonialId, 'testimonial/' + testimonialId).subscribe(data => {
            if(data) {
                this.alert.success("The testimonial deleted successfully!", true);
                this.loadTestimonalList(1);
            } else {
                this.alert.error("The testimonial can't be deleted!", true);
            }
        });
    }
}
