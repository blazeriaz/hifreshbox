import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { RestService, AlertService, MealMenuService, AuthService, CartService } from 'services';

import { FormBuilder, Validators, FormArray } from "@angular/forms";
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import * as GlobalVariable from 'global';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'menu.component.html'
})
export class MenuComponent implements OnInit, OnDestroy {
    @ViewChild('addcbmodal') addcbmodal: TemplateRef<any>;

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
    mealMenus = null;
    favRecipes = [];
    selectedRecipe;
    currentMenuDays;
    islogin;
    mealMenuProduct;
    orderSubscription;

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

    constructor(
    private alert: AlertService,
    private rest: RestService,
    private router: Router,
    private mealMenuService: MealMenuService,
    private auth: AuthService,
    private cartService: CartService,
    private _fb: FormBuilder,
    private modalService: BsModalService
    ) { }

    ngOnInit(): void {
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
            sku: null,
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
            
            this.loadedselectedRecipes = false;
            if (this.loadRecipesSub) {
                this.loadRecipesSub.unsubscribe();
            }
            this.mealMenus = null;
            this.loadRecipesSub = this.cartService.getMenuList().subscribe(mealMenus => {
                // Get recipes of Menu
                const sendData = {week_data : {
                    sku : '',
                    week_no : data.week,
                    year : data.year
                }}
                this.rest.saveItem(false, sendData, 'menus/weeklist').subscribe(recipes => {
                    mealMenus.items.map(mealMenu => {
                        /**const mealRecipes = recipes.filter(x => x.product_sku === mealMenu.sku);
                        mealMenu.recipes = mealRecipes.map(res => res.recipe_detail);**/
                        mealMenu.recipes = recipes.map(res => res.recipe_detail);
                        return mealMenu;
                    });
                    this.mealMenus = mealMenus;
                    this.loadedselectedRecipes = true;
                });
            });
        });

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

    isLogin() {
        return this.auth.isLogin();
    }

    addMealToCart(menuSku) {
        this.alert.clear();
        this.rest.showLoader();
        this.mealMenuProduct.cartItem.sku = menuSku;
        this.rest.getItem(menuSku, 'products/' + menuSku).subscribe(menuItem => {
            var customOptions = [];
            menuItem.options.forEach((option, i) => {
                if(option.title == 'Is Recurring Menu?' || i == 6) {
                    let option_type_id = option.values[0].option_type_id;
                    customOptions.push({
                        optionId: option.option_id,
                        optionValue: option_type_id
                    });
                }
                if(option.title == 'how much meals week') {
                    customOptions.push({
                        optionId: option.option_id,
                        optionValue: 3
                    });
                }
                if(option.title == 'how many people') {
                    customOptions.push({
                        optionId: option.option_id,
                        optionValue: 2
                    });
                }
            });
            this.mealMenuProduct.cartItem.productOption =  {
                extensionAttributes: {
                    customOptions: customOptions
                }
            };
            
            this.cartService.addItemToCart(this.mealMenuProduct).subscribe(res => {
                this.rest.hideLoader();
                this.cartService.increaseCartItem(res);
                this.router.navigate(['/', 'cart', 'checkout']);
            }, err => {
                this.rest.hideLoader();
                const e = err.json();
                this.alert.error(e.message);
            });
            window.scroll(0, 0);
        });
    }
    
    inFavRecipe(id) {
        return this.favRecipes.findIndex(x => x.product_id == id) !== -1;
    }

    recipeFavouriteClass(recipe) {
        let className = [];
        if (recipe.statusLoading) {
            className.push('disabled');
        }
        if (this.inFavRecipe(recipe.entity_id)) {
            className.push('text-success');
        }
        return className;
    }

    toggleFavourite(recipe) {
        if (recipe.statusLoading) {
            return;
        }
        if (!this.auth.isLogin()) {
            this.islogin = this.auth.isLogin();
            return;
        }
        this.alert.clear();
        if (this.inFavRecipe(recipe.entity_id)) {
            const item = this.favRecipes.find(x => x.product_id === recipe.entity_id);
            this.removeFromFavuorite(item);
        } else {
            recipe.statusLoading = true;
            this.rest.showLoader();
            this.rest.saveItem('', {}, 'ipwishlist/add/' + recipe.entity_id).subscribe(data => {                
                this.favRecipes.push(data[0]);
                this.alert.success('Recipe had been added to favourite!');
                recipe.statusLoading = false;
                this.rest.hideLoader();
            }, e => {
                recipe.statusLoading = false;
                this.rest.hideLoader();
            });
        }        
    }

    removeFromFavuorite(item) {
        if (!confirm('Are you sure to remove from favourite?')) {
            return;
        }
        this.alert.clear();
        item.statusLoading = false;
        this.rest.showLoader();
        this.rest.deleteItem(item.wishlist_item_id, 'ipwishlist/delete/' + item.wishlist_item_id).subscribe(res => {
            this.favRecipes = this.favRecipes.filter(x => x.wishlist_item_id !== item.wishlist_item_id);
            this.alert.success('Recipe had been removed from favourite!');
            item.statusLoading = false;
            this.rest.hideLoader();
        }, e => {
            item.statusLoading = false;
            this.rest.hideLoader();
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

    showRecipeDetails(recipe) {
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
        this.rest.showLoader();
        this.rest.saveItem(false, {cookbook: this.cbForm.value}, 'cookbook').subscribe(res => {
            if(res[0] == 'error') {
                this.modelDisabled = false;
                this.alert.error(res[1], false, 'popup');
                return;
            }
            res.recipe = [];
            this.cookbooks.push(res);
            this.modelDisabled = false;
            this.rest.hideLoader();
            this.addRecipeToCookBook(res);
            if (!this.selectRecipe) {
                this.alert.success('Cookbook has been saved successfully!');
            }
        }, e => {
            this.modelDisabled = false;
            var err = e.json();
            this.alert.error(err.message, false, 'popup');
            this.rest.hideLoader();
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
        this.rest.showLoader();
        this.rest.saveItem(false, sendData, 'cookbook-recipe').subscribe(res => {
            const cbIndex = this.cookbooks.findIndex(x => x.id === res.cookbook_id);
            this.selectRecipe.cookbook_recipe_id = res.id;
            this.cookbooks[cbIndex].recipe.push(this.selectRecipe);
            this.modelDisabled = false;
            this.selectRecipe = null;
            this.modalRef.hide();
            this.alert.success('Recipe added to the Cookbook successfully!');
            this.rest.hideLoader();
        }, err => {
            const e = err.json();
            this.modelDisabled = false;
            this.selectRecipe = null;
            this.modalRef.hide();
            this.alert.error(e.message);
            this.rest.hideLoader();
        });
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
}
