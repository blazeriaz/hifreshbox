import { Component, OnInit, OnDestroy, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { RestService, AlertService, PagerService } from 'services';

import { FormBuilder, Validators, FormArray } from '@angular/forms';

export const pageSize = 100;

@Component({
    templateUrl: 'list.component.html'
})
export class FaqsListComponent implements OnInit, OnDestroy {
    faqs: any;
    pager: any;
    loadingList;
    searchSubscripe;
    deleteItems;

    constructor(private rest: RestService,
                private alert: AlertService,
                private pagerService: PagerService,
                private route: ActivatedRoute,
                private router: Router,
                private _fb: FormBuilder ) {
    }

    ngOnInit(): void {
        this.deleteItems = [];
        this.loadFaqsList(1);
    }

    ngOnDestroy(): void {
        if (this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
    }

    loadFaqsList(pageNo?) {
        const filters = [];
        if (this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
        const sortOrders = [{
            field: 'creation_time',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, 'faqs/search', 'criteria', sortOrders).subscribe(faqs => {
            this.loadingList = false;
            this.initFaqsList(faqs, pageNo);
        });
    }

    initFaqsList(faqs, page?) {
        this.faqs = faqs.items.sort((a: any, b: any) => {
            if (a.sort_order < b.sort_order) {
                return -1;
            } else if (a.sort_order > b.sort_order) {
                return 1;
            } else {
                return 0;
            }
        });;
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

    sortFaqItems($event: any) {
        const new_position = this.faqs.findIndex(x => x.id === $event.id) + 1;
        if(new_position == $event.sort_order) {
            return;
        }
        const sendData = {
            faq_data: {
                faq_id: $event.id,
                old_position: $event.sort_order,
                new_position: new_position
            }
        };
        this.alert.clear();
        this.rest.saveItem(false, sendData, 'faqs/change-order').subscribe(d => {
            this.alert.success('Faq order was changed succesfully');
            this.loadFaqsList(1);
        }, e => {
            this.alert.error('Server error.');
            this.loadFaqsList(1);
        });
    }
}
