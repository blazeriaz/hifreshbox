import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService } from 'services';

import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { BASE_URL } from 'global';

export const pageSize = 10;

@Component({
    templateUrl: 'list.component.html'
})
export class RecipesListComponent implements OnInit {
    recipes: any;
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
        this.deleteItems = [];
        this.initLoad = true;
        this.searchForm = this._fb.group({
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadRecipesList(1));
        this.loadRecipesList(1);
    }

    recipePreviewLink(recipe) {
        const i = recipe.custom_attributes.findIndex(x => x.attribute_code === 'url_key');
        const url_key = recipe.custom_attributes[i].value;
        return BASE_URL + '#' + 'menu/' + url_key;
    }

    loadRecipesList(pageNo?) {
        const searchValues = this.searchForm.value;
        const filters = [];
        filters.push({
            filters : [{
                field : 'category_id',
                value : 41,
                condition_type : 'eq'
            }]
        });
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
        const sortOrders = [{
            field: 'created_at',
            direction: 'DESC'
        }];
        this.loadingList = true;
        this.searchSubscripe = this.rest.getItems(pageNo, filters, pageSize, 'products', false, sortOrders).subscribe(recipes => {
            this.initLoad = false;
            this.loadingList = false;
            this.initRecipesList(recipes, pageNo);
        });
    }

    initRecipesList(recipes, page?) {
        this.recipes = recipes.items;
        // get pager object from service
        page = page ? page : 1;
        this.pager = this.pagerService.getPager(recipes.total_count, page, pageSize);
    }

    abortSearch() {
        if (this.searchSubscripe) {
            this.searchSubscripe.unsubscribe();
        }
        this.loadingList = false;
    }

    setPage(page) {
        this.loadRecipesList(page);
    }

    isDeleted(sku) {
        return this.deleteItems.findIndex(item => item.sku === sku) !== -1;
    }

    cancelDelete(sku) {
        const i = this.deleteItems.findIndex(item => item.sku === sku);
        if (i !== -1) {
            this.deleteItems[i].subscribe.unsubscribe();
            this.deleteItems.splice(i, 1);
        }
    }

    deleteReceipe(recipeSku, page) {
        if (!confirm('Are you sure to delete the recipe?')) {
            return;
        }
        this.alert.clear();
        const deleteSubscribe = this.rest.deleteItem(recipeSku, 'products/' + recipeSku).subscribe(data => {
            if (data) {
                this.deleteItems = this.deleteItems.filter(item => item.sku = recipeSku);
                this.recipes = this.recipes.filter(item => item.sku = recipeSku);
                if (this.deleteItems.length === 0) {
                    this.alert.success('The recipes deleted successfully!', true);
                    this.initLoad = true;
                    this.loadRecipesList(page);
                }
            } else {
                this.deleteItems = this.deleteItems.filter(item => item.sku = recipeSku);
                this.alert.error('The recipe can\'t be deleted!', true);
            }
        });
        const deleteItem = {
            sku : recipeSku,
            subscribe : deleteSubscribe
        };
        this.deleteItems.push(deleteItem);
    }
}
