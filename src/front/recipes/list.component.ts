import { Component, OnInit, Injectable, Renderer2, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRouteSnapshot, Resolve, ActivatedRoute } from '@angular/router';
import { AlertService, PagerService, RestService, AuthService } from "services";

import { FormBuilder, Validators, FormArray } from "@angular/forms";

export const pageSize = 12;
import * as GlobalVariable from 'global';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
    templateUrl: 'list.component.html'
})
export class RecipesListComponent implements OnInit, OnDestroy {
    @ViewChild('addcbmodal') addcbmodal: TemplateRef<any>;
    
    recipes:any;
    pager: any;
    searchForm;
    searchSubscripe;
    loadingList;
    initLoad;
    deleteItems;
    globalVariable;
    favRecipes;

    modalRef: BsModalRef;
    modalViewRef: BsModalRef;
    loadedCookBooks;
    cookbooks = [];
    cbForm;
    showExistingCB;
    modelDisabled;
    showCBSubmitButton;
    selectRecipe;
    singleCB;
    user;

    constructor(private rest: RestService,
        private auth: AuthService,
                private alert: AlertService,
                private pagerService: PagerService,
                private route: ActivatedRoute,
                private router: Router,
                private _fb: FormBuilder,
                private renderer: Renderer2,
                private modalService: BsModalService ) {
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

        if(this.auth.isLogin()) {
            this.auth.getUserInfo().subscribe(user => {     
                if (!user) {
                    this.auth.initLoggedInUserInfo();
                } else if (!user.loading) {
                    this.user = user;
                } 
            });

            this.rest.getItems('', '', '', 'ipwishlist/items').subscribe(data => {
                this.favRecipes = data.map(x => x.product_id);
            });

            this.loadedCookBooks = false;
            this.rest.getItems(1, '', 10, 'cookbook/search', 'criteria').subscribe(cb => {
                this.cookbooks = cb.items;
                this.loadedCookBooks = true;
            });
        }
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

    showRecipeDetails(recipe) {
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

    setInputErrorClass(form, input) {
        const field = form.get(input);
        const invalid = field.invalid && field.touched;
        if (invalid) {
            return 'form-control-danger';
        }
    }

    setContainerErrorClass(form, input) {
        const field = form.get(input);
        const invalid = field.invalid && field.touched;
        if (invalid) {
            return 'has-danger';
        }
    }

    saveCookBook() {
        if (this.cbForm.invalid) {
            return;
        }
        this.modelDisabled = true;
        this.alert.clear();
        this.rest.saveItem(false, {cookbook: this.cbForm.value}, 'cookbook').subscribe(res => {
            if(res[0] == 'error') {
                this.modelDisabled = false;
                this.alert.error(res[1], false, 'popup');
                return;
            }
            res.recipe = [];
            this.cookbooks.push(res);
            this.modelDisabled = false;
            this.addRecipeToCookBook(res);
            this.alert.success('Cookbook has been saved successfully!');
        }, e => {
            this.modelDisabled = false;
            var err = e.json();
            this.alert.error(err.message, false, 'popup');
        });
    }

    addRecipeToCookBook(cookbook) {
        this.modelDisabled = true;
        if (!cookbook || !this.selectRecipe) {
            this.modelDisabled = false;
            this.modalRef.hide();
            return;
        }
        const sendData = {cookbook_recipe : {
            cookbook_id : cookbook.id,
            recipe_id : this.selectRecipe.sku
        }};
        this.alert.clear();
        this.rest.saveItem(false, sendData, 'cookbook-recipe').subscribe(res => {
            const cbIndex = this.cookbooks.findIndex(x => x.id === res.cookbook_id);
            this.selectRecipe.cookbook_recipe_id = res.id;
            this.cookbooks[cbIndex].recipe.push(this.selectRecipe);
            this.modelDisabled = false;
            this.selectRecipe = null;
            this.modalRef.hide();
            this.alert.success('Recipe added to the Cookbook successfully!');
        }, err => {
            const e = err.json();
            this.modelDisabled = false;
            this.selectRecipe = null;
            this.modalRef.hide();
            this.alert.error(e.message);
        });
    }

    addNewCookbook() {
        this.selectRecipe = null;
        this.showExistingCB = false;
        this.showCBSubmitButton = true;
        this.openAddCBModal();
    }

    addToCookbook(recipe) {
        this.selectRecipe = recipe;
        this.showExistingCB = this.cookbooks.length > 0;
        this.showCBSubmitButton = !this.showExistingCB;
        this.openAddCBModal();
    }

    openAddCBModal() {
        this.cbForm = this._fb.group({
            'user_id': this.user.id,
            'is_active': 1,
            'title': ['', Validators.required]
        });
        this.modalRef = this.modalService.show(this.addcbmodal, {
            animated: true,
            keyboard: false,
            backdrop: true
        });
    }

    removeFromFavuorite(wishlist_item_id) {
        if (!confirm('Are you sure to remove from favourite?')) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem(wishlist_item_id, 'ipwishlist/delete/' + wishlist_item_id).subscribe(res => {
            this.recipes = this.recipes.filter(x => x.wishlist_item_id !== wishlist_item_id);
            this.alert.success('Recipe had been removed from favourite!');
        });
    }
}
