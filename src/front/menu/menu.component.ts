import { Component, OnInit, OnDestroy } from '@angular/core';
import { RestService, AlertService, MealMenuService, AuthService, CartService } from 'services';

import * as GlobalVariable from 'global';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'menu.component.html'
})
export class MenuComponent implements OnInit, OnDestroy {
    backgrounds;
    globalVariable;
    startYear;
    endYear;
    currentYear;
    selectedWeek;
    yearMonthSubs;
    disablePreviousWeek;
    disableNextWeek;
    loadRecipesSub;
    loadedselectedRecipes;
    recipes = [];
    favRecipes = [];
    selectedRecipe;
    currentMenuDays;
    islogin;
    mealMenuProduct;

    constructor(
    private alert: AlertService,
    private rest: RestService,
    private router: Router,
    private mealMenuService: MealMenuService,
    private auth: AuthService,
    private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.islogin = this.auth.isLogin();
        this.globalVariable = GlobalVariable;
        this.backgrounds = {
            header: {
                'background-image': 'url('+GlobalVariable.htmlImages+'top-banner-week-menu.png)',
                'background-position' : 'bottom',
                'background-size': 'cover', 
                'background-attachment' : 'fixed',
                'background-color' : '#2F2F30'
            },
            recipe : GlobalVariable.htmlImages+'each-recipe-img.png',
            cap : GlobalVariable.htmlImages+'chef-cap-green.png',
            culinery : GlobalVariable.htmlImages+'culinery.png',
            whatfreshbox : GlobalVariable.htmlImages+'what-is-freshbox.png',
            gray : {
                'background-image': 'url('+GlobalVariable.htmlImages+'hiw-bg.png)',
                'background-position' : 'bottom',
                'background-color' : '#DFDFDF',
                'background-size': 'cover', 
            },
            testimonials : {
                'background-image': 'url('+GlobalVariable.htmlImages+'testimonials.png)',
                'background-size': 'cover', 
                'background-position' : 'bottom'
            },
            orders : {
                'background-image': 'url('+GlobalVariable.htmlImages+'orders-bg.png)',
                'background-size': '95% auto', 
                'background-position' : 'top left',
                'background-repeat' : 'no-repeat',
            },
            signup: {
                'background-image': 'url('+GlobalVariable.htmlImages+'newsletter-signup.png)',
                'background-size': 'cover', 
                'background-position' : 'bottom'
            }
        };

        this.mealMenuProduct = {cartItem: {
            quote_id: null,
            sku: 'freshbox-subscription',
            qty: 1,
            productOption: null
        }};

        this.cartService.getCartTotal().subscribe(res => {
            if (res.guestCardId) {
                this.mealMenuProduct.cartItem.quote_id = res.guestCardId
            } else if (res.cart && res.cart.id) {
                this.mealMenuProduct.cartItem.quote_id = res.cart.id
            }
        });

        const date = new Date();
        this.currentYear = date.getFullYear();
        this.startYear = 2017;
        this.endYear = this.currentYear + 10;
        this.currentMenuDays = this.mealMenuService.getCurrentMenuDays();

        this.yearMonthSubs = this.mealMenuService.getYearWeek().subscribe(data => {
            const tuesday = this.mealMenuService.getDateOfISOWeekStringFull(data.week, data.year);
            this.selectedWeek = {id: data.week, text: tuesday, year: data.year};

            this.disablePreviousWeek = false;
            const prevTuesday = this.mealMenuService.getDateOfISOWeekString(data.week - 1, data.year);
            if (data.year === this.startYear && !prevTuesday) {
                this.disablePreviousWeek = true;
            }

            this.disableNextWeek = false;
            const nextTuesday = this.mealMenuService.getDateOfISOWeekString(data.week + 1, data.year);
            if (data.year === this.endYear && !nextTuesday) {
                this.disableNextWeek = true;
            }
            // Get recipes of Menu
            const sendData = {week_data : {
                sku : 'freshbox-subscription',
                week_no : data.week,
                year : data.year
            }}
            this.loadedselectedRecipes = false;
            if (this.loadRecipesSub) {
                this.loadRecipesSub.unsubscribe();
            }
            this.loadRecipesSub = this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
                this.recipes = recipes.map(res => res.recipe_detail);
                this.loadedselectedRecipes = true;
            });
        });
        this.rest.getItems('', '', '', 'ipwishlist/items').subscribe(data => {
            this.favRecipes = data.map(x => x.product_id);
        });
    }

    addMealToCart() {
        this.alert.clear();
        this.rest.showLoader();
        this.cartService.addItemToCart(this.mealMenuProduct).subscribe(res => {
            this.cartService.increaseCartItem(res);
            this.router.navigate(['/', 'cart', 'checkout']);
        }, err => {
            this.rest.hideLoader();
            this.alert.error(err);
        });
        window.scroll(0, 0);
    }

    recipeFavouriteClass(recipe) {
        if (this.favRecipes.indexOf(recipe.entity_id) !== -1) {
            return 'text-success';
        }
        return '';
    }

    addToFavourite(recipe) {
        if (!this.auth.isLogin()) {
            this.islogin = this.auth.isLogin();
            return;
        }
        this.rest.saveItem('', {}, 'ipwishlist/add/' + recipe.entity_id).subscribe(data => {
            this.favRecipes.push(recipe.entity_id);
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
        this.yearMonthSubs.unsubscribe();
    }

    selectRecipe(recipe) {
        this.router.navigate(['menu', recipe.url_key]);
    }

    gotToPrevWeek() {
        const prevTuesday = this.mealMenuService.getDateOfISOWeek(this.selectedWeek.id - 1, this.selectedWeek.year);
        if (!prevTuesday) {
            return;
        }
        const prevWeek = this.mealMenuService.getWeekNumber(prevTuesday);
        this.mealMenuService.setYearWeek(prevTuesday.getFullYear(), prevWeek);
    }

    gotToNextWeek() {
        const nextTuesday = this.mealMenuService.getDateOfISOWeek(this.selectedWeek.id + 1, this.selectedWeek.year);
        if (!nextTuesday) {
            return;
        }
        const nextWeek = this.mealMenuService.getWeekNumber(nextTuesday);
        this.mealMenuService.setYearWeek(nextTuesday.getFullYear(), nextWeek);
    }
}
