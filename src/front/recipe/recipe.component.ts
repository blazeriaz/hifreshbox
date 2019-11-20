import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as GlobalVariable from 'global';
import { AlertService, RestService, AuthService, CartService, MealMenuService } from 'services';
import { LayoutService } from 'services/layout.service';

@Component({
    templateUrl: 'recipe.component.html'
})
export class RecipeComponent implements OnInit, OnDestroy {
    backgrounds;
    loadedRecipe;
    recipe;
    currentMenuRecipes;
    mealMenuProduct;
    orderSubscription;
    stepImageBaseUrl = GlobalVariable.BASE_MEDIA + 'recipe-steps/';
    resBP;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute,
        private router: Router,
        private renderer: Renderer2,
        private auth: AuthService,
        private mealMenuService: MealMenuService,
        private cartService: CartService,
        private layoutService: LayoutService
    ) { }

    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'position': 'absolute',
                'top': '-100px',
                'left': '-15px',
                'width': '85%',
                'height': 'calc(100% + 100px)',
                'background-image': 'url(' + GlobalVariable.htmlImages + 'desktop-brush.png)',
                'background-position' : 'top right',
                'background-size': 'cover',
                'background-repeat' : 'no-repeat',
                'z-index': 2
            },
            headerM: {
                'position': 'absolute',
                'top': '-75px',
                'left': '-15px',
                'width': 'calc(100% + 30px)',
                'height': '100%',
                'background-image': 'url(' + GlobalVariable.htmlImages + 'mobile-brush.png)',
                'background-position' : 'top right',
                'background-size': '100% auto',
                'background-repeat' : 'no-repeat',
                'z-index': 2
            },
            recipe : GlobalVariable.htmlImages + 'each-recipe-img.png',
            singlerecipe : GlobalVariable.htmlImages + 'single-recipe.png',
            cap : GlobalVariable.htmlImages + 'chef-cap-green.png',
            culinery : GlobalVariable.htmlImages + 'culinery.png',
            whatfreshbox : GlobalVariable.htmlImages + 'what-is-freshbox.png',
            gray : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'hiw-bg.png)',
                'background-position' : 'bottom',
                'background-color' : '#DFDFDF',
                'background-size': 'cover'
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

        this.orderSubscription = null;
        this.cartService.getCartTotal().subscribe(res => {
            if (res.guestCardId) {
                this.mealMenuProduct.cartItem.quote_id = res.guestCardId
            } else if (res.cart && res.cart.id) {
                this.mealMenuProduct.cartItem.quote_id = res.cart.id
            }
            if(res.subscription) {
                this.orderSubscription = res.subscription;
            }
        });
        this.loadRecipe();

        this.layoutService.getCurrentBreakPointState().subscribe(bp => {
            this.removeAllBodyClassDeclar();
            if (['xs', 'sm'].indexOf(bp) !== -1) {
                this.renderer.addClass(document.body, 'black-bg-header');
                this.resBP = 'm';
            } else {
                this.renderer.addClass(document.body, 'white-header');
                this.resBP = 'd';
            }
        })
    }

    removeAllBodyClassDeclar() {
        this.renderer.removeClass(document.body, 'black-bg-header');
        this.renderer.removeClass(document.body, 'white-header');
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
            if(recipe[0] == 'error') {
                this.router.navigate(['/', '404']);
                return;
            }
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
        this.removeAllBodyClassDeclar();
    }
}
