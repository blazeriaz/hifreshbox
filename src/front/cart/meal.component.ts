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
    selectedPreferences = [];
    MealProduct;

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

        this.checkoutMealForm = this._fb.group({
            howmuch_meals_week: [1, [Validators.required]],
            howmany_people: [1, [Validators.required]],
            meal_extra_notes: '',
        });

        this.MealProduct = {cart_item: {
            quote_id: null,
            product_id: 2078,
            qty: 1,
            preferences: null,
            howmuch_meals_week: 1,
            howmany_people: 1,
            meal_extra_notes: 1
        }};

        this.cartService.getCartTotal().subscribe(res => {
            if (res.guestCardId) {
                this.MealProduct.cart_item.quote_id = res.guestCardId
            } else if (res.cart && res.cart.id) {
                this.MealProduct.cart_item.quote_id = res.cart.id
            }
        });

        this.rest.getItems(1, [], 1000, 'meals/search', 'criteria').subscribe(res => {
            this.preferences = res.items;
        });
    }

    selectPreference(preference, option) {
        const index = this.selectedPreferences.findIndex(x => {
            return x.option_id && x.option_id === option.preference_option_id
        });
        if (index === -1) {
            this.selectedPreferences.push({
                question_id: preference.preference_id,
                option_id: option.preference_option_id,
                qty: 1
            });
            option.qty = 1;
        } else {
            const qty = option.qty + 1;
            this.selectedPreferences[index].qty = qty;
            option.qty = qty;
        }
    }

    decresePreference(preference, option) {
        const index = this.selectedPreferences.findIndex(x => {
            return x.option_id && x.option_id === option.preference_option_id
        });
        if (index !== -1) {
            const qty = option.qty - 1;
            this.selectedPreferences[index].qty = qty;
            option.qty = qty;
        }
    }

    removePreference(preference, option) {
        this.selectedPreferences = this.selectedPreferences.filter(x => {
            return x.option_id && x.option_id !== option.preference_option_id
        });
        option.qty = 0;
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
            this.MealProduct.cart_item.howmuch_meals_week = this.checkoutMealForm.value.howmuch_meals_week,
            this.MealProduct.cart_item.howmany_people = this.checkoutMealForm.value.howmany_people,
            this.MealProduct.cart_item.meal_extra_notes = this.checkoutMealForm.value.meal_extra_notes;
            this.MealProduct.cart_item.preferences = this.selectedPreferences;
            this.cartService.addMealToCart(this.MealProduct).subscribe(res => {
                this.next.emit('meal');
                this.cartService.setCartTotal();
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
    }
}
