import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService } from 'services';

import { FormBuilder, Validators, FormArray } from '@angular/forms';

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class CardsListComponent implements OnInit {
    public cards: any;
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
        private _fb: FormBuilder ) { }

    ngOnInit(): void {
        this.initLoad = true;
        this.deleteItems = [];
        this.searchForm = this._fb.group({
            name : ''
        });

        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadCardsList(1));

        this.loadCardsList();
    }

    loadCardsList(pageNo?) {
        const filters = [];
        const searchValues = this.searchForm.value;
        if (searchValues && searchValues.name) {
            filters.push({
                filters : [{
                    field : 'name',
                    value : '%' + searchValues.name + '%',
                    condition_type : 'like'
                }]
            });
        }
        if (this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
        const sortCards = [{
            field: 'created_at',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, 'payment/listcreditcard', 'criteria', sortCards)
            .subscribe(cards => {
            this.initLoad = false;
            this.loadingList = false;
            this.initCardsList(cards, pageNo);
        });
    }

    initCardsList(cards, page?) {
        this.cards = cards.map(x => {
            x.details = JSON.parse(x.details);
            return x;
        });
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(cards.length, page, pageSize);
    }

    abortSearch() {
        // tslint:disable-next-line:no-unused-expression
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadCardsList(page);
    }
}
