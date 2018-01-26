import { Component, OnInit, OnDestroy, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { RestService, AlertService, MealMenuService, AuthService, PagerService } from 'services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
export const pageSize = 12;
import * as GlobalVariable from 'global';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'cookbooks.component.html'
})
export class CookbooksComponent implements OnInit, OnDestroy {
    @ViewChild('viewcbcookbooks') viewcbcookbooks: TemplateRef<any>;

    modalRef: BsModalRef;
    modalViewRef: BsModalRef;
    globalVariable;
    loadedCookBooks;
    cookbooks = [];
    singleCB;
    searchForm;
    searchSubscripe;
    pager;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: Router,
        private mealMenuService: MealMenuService,
        private auth: AuthService,
        private renderer: Renderer2,
        private modalService: BsModalService,
        private _fb: FormBuilder,
        private pagerService: PagerService
    ) { }

    ngOnInit(): void {
        this.globalVariable = GlobalVariable;

        this.searchForm = this._fb.group({
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadCookbooksList(1));
        this.loadCookbooksList(1);
        this.renderer.addClass(document.body, 'white-header');
    }

    loadCookbooksList(pageNo?) {
        let searchValues = this.searchForm.value;
        let filters = [];
        if(searchValues && searchValues.name) {
            let searchNameFilter = {
                filters : [{
                    field : "title",
                    value : "%" + searchValues.name + "%",
                    condition_type : 'like'
                }]
            };
            filters.push(searchNameFilter);
        }
        if(this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
        this.loadedCookBooks = false;
        this.cookbooks = [];
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, 'cookbook/guestsearch', 'criteria').subscribe(cookbooks => {
            this.loadedCookBooks = true;
            this.initCookbooksList(cookbooks, pageNo);
        });        
    }
    
    initCookbooksList(cookbooks, page?) {
        this.cookbooks = cookbooks.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(cookbooks.total_count, page, pageSize);        
    }

    setPage(page) {
        this.loadCookbooksList(page);
    }

    viewCookbook(cookbook) {
        this.singleCB = cookbook;
        this.modalViewRef = this.modalService.show(this.viewcbcookbooks, {
            animated: true,
            keyboard: false,
            backdrop: true
        });
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
