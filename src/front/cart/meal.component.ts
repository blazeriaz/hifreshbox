import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService, CartService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'checkout-meal',
    templateUrl: 'meal.component.html'
})
export class MealComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();

    checkoutMealForm;
    checkoutMealSubmitted;
    preferences;
    MealProduct;
    loading;
    needToDestroyEvents = [];

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private _fb: FormBuilder,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.loading = false;
        this.checkoutMealForm = this._fb.group({
            howmuch_meals_week: [3, [Validators.required]],
            howmany_people: [2, [Validators.required]],
            meal_extra_notes: '',
        });

        this.MealProduct = {cart_item: {
            quote_id: null,
            product_id: 2078,
            qty: 1,
            preferences: null,
            howmuch_meals_week: 3,
            howmany_people: 2,
            meal_extra_notes: 1
        }};
        this.rest.showLoader();
        this.needToDestroyEvents.push(this.cartService.getCartTotal().subscribe(data => {
            if (data.guestCardId) {
                this.MealProduct.cart_item.quote_id = data.guestCardId
            } else if (data.cart && data.cart.id) {
                this.MealProduct.cart_item.quote_id = data.cart.id
            }
            if(!data.cart || data.cart.loading || data.cart.mealPreferenceLoading) {
                return;
            }
            if (data.mealPreferences && data.mealPreferences.length > 0) {
                const formValues = {};
                data.mealPreferences.forEach((x, i) => {
                    if (i === 0) {
                        this.preferences = x;
                    } else {
                        Object.keys(x).forEach((key) => {
                            formValues[key] = parseInt(x[key], 10) ? parseInt(x[key], 10) : x[key];
                        });
                    }
                });
                this.checkoutMealForm.patchValue(formValues);
                this.rest.hideLoader();
            }
        }))
    }

    parseInt(v) {
        return parseInt(v, 10);
    }

    selectPreference(preference, option) {
        option.is_selected = 1;
        option.selected_qty = option.selected_qty ? (option.selected_qty + 1) : 1;
        if (!option.qty_enabled || option.qty_enabled === '0' || option.qty_enabled === 0) {
            option.selected_qty = 1;
        }
    }

    decresePreference(preference, option) {
        option.selected_qty = option.is_selected ? (option.selected_qty - 1) : 0;
        if (option.selected_qty === 0) {
            this.removePreference(preference, option);
        }
    }

    removePreference(preference, option) {
        delete option.is_selected;
        delete option.selected_qty;
    }

    setInputClass(input) {
        const invalid = this.checkoutMealForm.get(input).invalid;
        return (invalid && this.checkoutMealSubmitted) ? 'form-control-danger' : '';
    }

    setInputDivClass(input) {
        const invalid = this.checkoutMealForm.get(input).invalid;
        return (invalid && this.checkoutMealSubmitted) ? 'has-danger' : '';
    }

    saveCheckoutMeal() {
        this.checkoutMealSubmitted = true;
        this.alert.clear();
        if (this.checkoutMealForm.valid) {
            this.MealProduct.cart_item.howmuch_meals_week = 3;//this.checkoutMealForm.value.howmuch_meals_week,
            this.MealProduct.cart_item.howmany_people = this.checkoutMealForm.value.howmany_people,
            this.MealProduct.cart_item.meal_extra_notes = this.checkoutMealForm.value.meal_extra_notes;
            this.MealProduct.cart_item.preferences = [];
            this.preferences.forEach(x => {
                x.options.forEach(y => {
                    if (y.is_selected) {
                        this.MealProduct.cart_item.preferences.push({
                            question_id: y.preference_id,
                            option_id: y.preference_option_id,
                            qty: y.selected_qty
                        });
                    }
                })
            });
            this.loading = true;
            this.rest.showLoader();
            this.cartService.addMealToCart(this.MealProduct).subscribe(res => {
                this.rest.hideLoader();
                this.next.emit('meal');
            }, e => {
                this.rest.hideLoader();
                const err = e.json();
                this.loading = false;
                this.alert.error(err.message);
            })
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }

    goBack() {
        this.back.emit('meal');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
