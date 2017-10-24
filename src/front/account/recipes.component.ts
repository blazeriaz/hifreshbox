import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, AlertService, MealMenuService, AuthService } from 'services';

import * as GlobalVariable from 'global';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'recipes.component.html'
})
export class RecipesComponent implements OnInit, OnDestroy {
    globalVariable;
    loadRecipesSub;
    loadedselectedRecipes;
    recipes;
    islogin;

    constructor(
    private alert: AlertService,
    private rest: RestService,
    private route: Router,
    private mealMenuService: MealMenuService,
    private auth: AuthService
    ) { }

    ngOnInit(): void {
        this.islogin = this.auth.isLogin();
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
        this.loadRecipesSub = this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
            this.recipes = recipes.map(res => res.recipe_detail);
            this.loadedselectedRecipes = true;
        });

        this.rest.getItems('', '', '', 'ipwishlist/items').subscribe(data => {
        });
    }

    addToFavourite(recipe) {
        if (!this.auth.isLogin()) {
            this.islogin = this.auth.isLogin();
            return;
        }
        this.rest.saveItem('', {}, 'ipwishlist/add/' + recipe.entity_id).subscribe(data => {
        });
    }

    removeFavourite(recipe) {
        if (!this.auth.isLogin()) {
            this.islogin = this.auth.isLogin();
            return;
        }
        this.rest.deleteItem('', 'ipwishlist/delete/' + recipe.entity_id).subscribe(data => {
        });
    }

    ngOnDestroy() {

    }

    selectRecipe(sku) {
        this.route.navigate(['menu', sku]);
    }
}
