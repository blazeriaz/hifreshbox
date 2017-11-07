import { Component, OnInit, OnDestroy, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { RestService, AlertService, MealMenuService, AuthService } from 'services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as GlobalVariable from 'global';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'recipes.component.html'
})
export class RecipesComponent implements OnInit, OnDestroy {
    @ViewChild('addcbmodal') addcbmodal: TemplateRef<any>;
    @ViewChild('viewcbrecipes') viewcbrecipes: TemplateRef<any>;

    modalRef: BsModalRef;
    modalViewRef: BsModalRef;
    globalVariable;
    loadRecipesSub;
    loadedselectedRecipes;
    recipes;
    loadedCookBooks;
    cookbooks = [];
    cbForm;
    showExistingCB;
    modelDisabled;
    showCBSubmitButton;
    selectRecipe;
    singleCB;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: Router,
        private mealMenuService: MealMenuService,
        private auth: AuthService,
        private renderer: Renderer2,
        private modalService: BsModalService,
        private _fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.globalVariable = GlobalVariable;

        // Get recipes of Menu
        const sendData = {week_data : {
            sku : 'freshbox-subscription',
            week_no : 44,
            year : 2017
        }}
        this.loadedselectedRecipes = false;
        if (this.loadRecipesSub) {
            this.loadRecipesSub.unsubscribe();
        }

        this.rest.getItems('', '', '', 'ipwishlist/items').subscribe(recipes => {
            this.recipes = recipes;
            this.loadedselectedRecipes = true;
        });

        this.loadedCookBooks = false;
        this.rest.getItems(1, '', 10, 'cookbook/search', 'criteria').subscribe(cb => {
            this.cookbooks = cb.items;
            this.loadedCookBooks = true;
        });

        this.rest.getItem('me', 'customers/me').subscribe(user => {
            this.cbForm = this._fb.group({
                'user_id': user.id,
                'is_active': 1,
                'title': ['', Validators.required]
            });
        });
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
            res.recipe = [];
            this.cookbooks.push(res);
            this.modelDisabled = false;
            this.addRecipeToCookBook(res);
            this.alert.success('Cookbook has been saved successfully!');
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
        this.cbForm.reset();
        this.modalRef = this.modalService.show(this.addcbmodal, {
            animated: true,
            keyboard: false,
            backdrop: true
        });
    }

    viewCookbook(cookbook) {
        this.singleCB = cookbook;
        this.modalViewRef = this.modalService.show(this.viewcbrecipes, {
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

    removeCookbook(cookbook_id) {
        if (!confirm('Are you sure to delete the cookbook?')) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem(cookbook_id, 'cookbook/' + cookbook_id).subscribe(res => {
            this.cookbooks = this.cookbooks.filter(x => x.id !== cookbook_id);
            this.alert.success('Cookbook had been deleted!');
        });
    }

    removeRecipeFromCookbook(cookbook, recipe) {
        if (!confirm('Are you sure to remove the revipe from cookbook?')) {
            return;
        }
        this.alert.clear();
        this.rest.deleteItem(recipe.cookbook_recipe_id, 'cookbook-recipe/' + recipe.cookbook_recipe_id).subscribe(res => {
            const cbIndex = this.cookbooks.findIndex(x => x.id === cookbook.id);
            this.cookbooks[cbIndex].recipe = this.cookbooks[cbIndex].recipe.filter(x => x.cookbook_recipe_id !== recipe.cookbook_recipe_id);
            this.alert.success('Recipe had been removed from cookbook!');
        });
    }

    ngOnDestroy() {
    }
}