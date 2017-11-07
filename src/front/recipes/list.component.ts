import { Component, OnInit, Injectable, Renderer2, OnDestroy } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService, AuthService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 12;
import * as GlobalVariable from 'global';

@Component({
    templateUrl: 'list.component.html'
})
export class RecipesListComponent implements OnInit, OnDestroy {
    recipes:any;
    pager: any;
    searchForm;
    searchSubscripe;
    loadingList;
    initLoad;
    deleteItems;
    globalVariable;
    favRecipes;

    constructor(private rest: RestService,
        private auth: AuthService,
                private alert: AlertService,
                private pagerService: PagerService,
                private route: ActivatedRoute,
                private router: Router,
                private _fb: FormBuilder,
                private renderer: Renderer2 ) {
    }

    ngOnInit(): void {
        this.globalVariable = GlobalVariable;
        this.deleteItems = [];
        this.initLoad = true;
        this.searchForm = this._fb.group({
            name : ''
        });
        this.searchForm.valueChanges
            .debounceTime(500)
            .subscribe(values => this.loadRecipesList(1));
        this.loadRecipesList(1);
        this.renderer.addClass(document.body, 'white-header');

        this.favRecipes = [];
        this.rest.getItems('', '', '', 'ipwishlist/items').subscribe(data => {
            this.favRecipes = data.map(x => x.product_id);
        });
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }

    loadRecipesList(pageNo?) {
        let searchValues = this.searchForm.value;
        let filters = [];
        filters.push({
            filters : [{
                field : "category_id",
                value : 41,
                condition_type : 'eq'
            }]
        });

        filters.push({
            filters : [{
                field : "status",
                value : 1,
                condition_type : 'eq'
            }]
        });

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

    recipeFavouriteClass(recipe) {
        if (this.favRecipes.indexOf(recipe.id) !== -1) {
            return 'text-success';
        }
        return '';
    }

    addToFavourite(recipe) {
        if (!this.isLogin()) {
            return;
        }
        this.rest.saveItem('', {}, 'ipwishlist/add/' + recipe.id).subscribe(data => {
            this.favRecipes.push(recipe.id);
        });
    }    

    selectRecipe(recipe) {
        const attr = recipe.custom_attributes.find(x => x.attribute_code === 'url_key');
        this.router.navigate(['/', 'menu', attr.value]);
    }

    isLogin() {
        return this.auth.isLogin();
    }
    
    initRecipesList(recipes, page?) {
        this.recipes = recipes.items;        
        // get pager object from service
        page = page?page:1;
        this.pager = this.pagerService.getPager(recipes.total_count, page, pageSize);        
    }

    abortSearch() {
        this.searchSubscripe && this.searchSubscripe.unsubscribe();
        this.loadingList = false;
    }

    setPage(page) {
        this.loadRecipesList(page);
    }

    isDeleted(sku) {
        return this.deleteItems.findIndex(item => item.sku == sku) !== -1;
    }

    cancelDelete(sku) {
        let i = this.deleteItems.findIndex(item => item.sku == sku);
        this.deleteItems[i].subscribe.unsubscribe();
        this.deleteItems.splice(i,1);
    }

    deleteReceipe(recipeSku, page) {
        if(!confirm("Are you sure to delete the recipe?")) {
            return;
        }
        this.alert.clear();
        let deleteSubscribe = this.rest.deleteItem(recipeSku, 'products/'+recipeSku).subscribe(data => {
            if(data) {                
                this.deleteItems = this.deleteItems.filter(item => item.sku != recipeSku);
                this.recipes = this.recipes.filter(item => item.sku != recipeSku);
                if(this.deleteItems.length == 0) {
                    this.alert.success("The recipes deleted successfully!", true);
                    this.initLoad = true;
                    this.loadRecipesList(page);
                }
            } else {
                this.deleteItems = this.deleteItems.filter(item => item.sku != recipeSku);
                this.alert.error("The recipe can't be deleted!", true);
            }
        });
        let deleteItem = {
            sku : recipeSku,
            subscribe : deleteSubscribe
        };
        this.deleteItems.push(deleteItem);
    }
}
