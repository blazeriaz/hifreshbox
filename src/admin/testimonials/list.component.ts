import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { RestService, AlertService, PagerService } from 'services';

import { FormBuilder, Validators, FormArray } from '@angular/forms';

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class TestimonialsListComponent implements OnInit {
    testimonials: any;
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
                private _fb: FormBuilder ) {
    }

    ngOnInit(): void {
        this.initLoad = true;
        this.deleteItems = [];
        this.searchForm = this._fb.group({
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadTestimonialsList(1));
        this.loadTestimonialsList(1);
    }

    loadTestimonialsList(pageNo?) {
        const filters = [];
        const searchValues = this.searchForm.value;
        if (searchValues && searchValues.name) {
            filters.push({
                filters : [{
                    field : 'question',
                    value : '%' + searchValues.name + '%',
                    condition_type : 'like'
                }, {
                    field : 'answer',
                    value : '%' + searchValues.name + '%',
                    condition_type : 'like'
                }]
            });
        }
        if (this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
        const sortOrders = [{
            field: 'sort_order',
            direction: 'ASC'
        }];
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize,
            'testimonials/search', 'criteria', sortOrders).subscribe(testimonials => {
            this.initLoad = false;
            this.loadingList = false;
            this.initTestimonialsList(testimonials, pageNo);
        });
    }

    initTestimonialsList(testimonials, page?) {
        this.testimonials = testimonials.items;
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(testimonials.total_count, page, pageSize);
    }

    abortSearch() {
        // tslint:disable-next-line:no-unused-expression
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadTestimonialsList(page);
    }

    isDeleted(id) {
        return this.deleteItems.findIndex(item => item.id === id) !== -1;
    }

    cancelDelete(id) {
        const i = this.deleteItems.findIndex(item => item.id === id);
        this.deleteItems[i].subscribe.unsubscribe();
        this.deleteItems.splice(i, 1);
    }

    deleteTestimonial(testimonialId) {
        if (!confirm('Are you sure to delete the testimonial?')) {
            return;
        }
        this.alert.clear();
        const deleteSubscribe = this.rest.deleteItem(testimonialId, 'testimonials/' + testimonialId).subscribe(data => {
            if (data) {
                this.deleteItems = this.deleteItems.filter(item => item.id !== testimonialId);
                this.testimonials = this.testimonials.filter(item => item.id !== testimonialId);
                if (this.deleteItems.length === 0) {
                    this.alert.success('The testimonials deleted successfully!', true);
                    this.initLoad = true;
                    this.loadTestimonialsList(this.pager.currentPage);
                }
            } else {
                this.deleteItems = this.deleteItems.filter(item => item.id !== testimonialId);
            }
        }, error => {
            this.deleteItems = this.deleteItems.filter(item => item.id !== testimonialId);
        });
        const deleteItem = {
            id : testimonialId,
            subscribe : deleteSubscribe
        };
        this.deleteItems.push(deleteItem);
    }

    sortTestimonialItems ($event: any) {
        const new_position = this.testimonials.findIndex(x => x.id === $event.id) + 1;
        if(new_position == $event.sort_order) {
            return;
        }
        const sendData = {
            testimonial_data: {
                testimonial_id: $event.id,
                old_position: $event.sort_order,
                new_position: new_position
            }
        };
        this.alert.clear();
        this.rest.saveItem(false, sendData, 'testimonials/change-order').subscribe(d => {
            this.alert.success('Testimonial order was changed succesfully');
            this.loadTestimonialsList(this.pager.currentPage);
        }, e => {
            this.alert.error('Server error.');
            this.loadTestimonialsList(this.pager.currentPage);
        });
    }
}
