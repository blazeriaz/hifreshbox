import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, RestService, AuthService, CartService, MealMenuService } from 'services';

@Component({
    templateUrl: 'recipe.component.html'
})
export class RecipeComponent implements OnInit, OnDestroy {
    backgrounds;
    loadedRecipe;
    recipe;
    currentMenuRecipes;
    mealMenuProduct;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router,
        private renderer: Renderer2,
        private auth: AuthService,
        private mealMenuService: MealMenuService,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.backgrounds = {
            header: {
                'background-image': 'url('+GlobalVariable.htmlImages+'top-banner-single-recipe.png)',
                'background-position' : 'top left',
                'background-size': 'cover', 
                'background-repeat' : 'no-repeat'
            },
            recipe : GlobalVariable.htmlImages+'each-recipe-img.png',
            singlerecipe : GlobalVariable.htmlImages+'single-recipe.png',
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
        this.loadRecipe();
    }

    isLogin() {
        return this.auth.isLogin();
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

    loadRecipe() {
        this.loadedRecipe = false;
        const recipeSku = this.route.snapshot.params['sku'];
        this.rest.getItem(recipeSku, 'recipedetail/' + recipeSku).subscribe(recipe => {
            this.loadedRecipe = true;
            this.recipe = recipe;
            const currentMenuDays = this.mealMenuService.getCurrentyearMonth();
            const sendData = {week_data : {
                sku : 'freshbox-subscription',
                week_no : currentMenuDays.week,
                year : currentMenuDays.year
            }}
            this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
                const index = recipes.findIndex(x => x.recipe_detail.sku === this.recipe.sku);
                if(index !== -1) {
                    this.recipe.inCurrentMenu = 1;
                }
            });
        });
    }

    backToMenu() {
        this.router.navigate(['menu']);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
