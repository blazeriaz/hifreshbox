import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { RestService, AlertService, PagerService } from 'services';

import { FormBuilder, Validators, FormArray } from '@angular/forms';

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class FaqsListComponent implements OnInit {
    faqs: any;
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
            .subscribe(values => this.loadFaqsList(1));
        this.loadFaqsList(1);
    }

    loadFaqsList(pageNo?) {
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
            field: 'creation_time',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, 'faqs/search', 'criteria', sortOrders).subscribe(faqs => {
            this.initLoad = false;
            this.loadingList = false;
            this.initFaqsList(faqs, pageNo);
        });
    }

    initFaqsList(faqs, page?) {
        this.faqs = faqs.items;
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(faqs.total_count, page, pageSize);
    }

    abortSearch() {
        // tslint:disable-next-line:no-unused-expression
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadFaqsList(page);
    }

    isDeleted(id) {
        return this.deleteItems.findIndex(item => item.id === id) !== -1;
    }

    cancelDelete(id) {
        const i = this.deleteItems.findIndex(item => item.id === id);
        this.deleteItems[i].subscribe.unsubscribe();
        this.deleteItems.splice(i, 1);
    }

    deleteFaq(faqId) {
        if (!confirm('Are you sure to delete the faq?')) {
            return;
        }
        this.alert.clear();
        const deleteSubscribe = this.rest.deleteItem(faqId, 'faqs/' + faqId).subscribe(data => {
            if (data) {
                this.deleteItems = this.deleteItems.filter(item => item.id !== faqId);
                this.faqs = this.faqs.filter(item => item.id !== faqId);
                if (this.deleteItems.length === 0) {
                    this.alert.success('The faqs deleted successfully!', true);
                    this.initLoad = true;
                    this.loadFaqsList(this.pager.currentPage); 
                }
            } else {
                this.deleteItems = this.deleteItems.filter(item => item.id != faqId);
            }
        }, error => {
            this.deleteItems = this.deleteItems.filter(item => item.id != faqId);
        });
        const deleteItem = {
            id : faqId,
            subscribe : deleteSubscribe
        };
        this.deleteItems.push(deleteItem);
    }
}
