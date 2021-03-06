import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService, CartService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    templateUrl: 'meal.component.html'
})
export class MealComponent implements OnInit, OnDestroy {
    userMealPrefForm;
    userMealPrefSubmitted;
    preferences;
    userMealPrefData;
    loading;

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
        this.loading = false;
        this.userMealPrefForm = this._fb.group({
            howmuch_meals_week: [3, [Validators.required]],
            howmany_people: [2, [Validators.required]],
            meal_extra_notes: '',
        });

        this.userMealPrefData = {subscribepreference: {
            meal_preference_setting: null,
            howmuch_meals_week: 3,
            howmany_people: 2,
            meal_extra_notes: ''
        }}; 

        this.rest.getItems(1, [], 1000, 'meals/user-meal-search', 'criteria').subscribe(mealPreferences => {
            if (mealPreferences && mealPreferences.length > 0) {
                const formValues = {};
                mealPreferences.forEach((y, i) => {
                    if (i === 0) {
                        this.preferences = y;
                        this.preferences.map(x => {
                            x.options = x.options.filter(y => parseInt(y.is_active, 10) === 1);
                            return x;
                        });
                        this.preferences = this.preferences.filter(x => x.options.length > 0 && parseInt(x.is_active, 10) === 1);
                    } else {
                        Object.keys(y).forEach((key) => {
                            formValues[key] = parseInt(y[key], 10) ? parseInt(y[key], 10) : y[key];
                        });
                    }
                });
                formValues['howmuch_meals_week'] = 3;
                if(!formValues['howmany_people']) {
                    formValues['howmany_people'] = 2;
                }
                this.userMealPrefForm.patchValue(formValues);
            }
        });
    }

    parseInt(v) {
        return parseInt(v, 10);
    }

    selectPreference(preference, option, prefIndex) {
        option.selected_qty = option.selected_qty ? (option.selected_qty + 1) : 1;
        if (!option.qty_enabled || option.qty_enabled === '0' || option.qty_enabled === 0) {
            option.selected_qty = 1;
            if(option.is_selected) {
                this.removePreference(preference, option);
                return;
            }
        }
        option.is_selected = 1;
        if(prefIndex === 0) {
            preference.options.forEach(opt => {
                if(opt.preference_option_id != option.preference_option_id) {
                    this.removePreference(preference, opt);
                }
            });            
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
        const invalid = this.userMealPrefForm.get(input).invalid;
        return (invalid && this.userMealPrefSubmitted) ? 'form-control-danger' : '';
    }

    setInputDivClass(input) {
        const invalid = this.userMealPrefForm.get(input).invalid;
        return (invalid && this.userMealPrefSubmitted) ? 'has-danger' : '';
    }

    saveUserMealPref() {
        this.userMealPrefSubmitted = true;
        this.alert.clear();
        if (this.userMealPrefForm.valid) {
            this.userMealPrefData.subscribepreference.howmuch_meals_week = 3;//this.userMealPrefForm.value.howmuch_meals_week,
            this.userMealPrefData.subscribepreference.howmany_people = this.userMealPrefForm.value.howmany_people,
            this.userMealPrefData.subscribepreference.meal_extra_notes = this.userMealPrefForm.value.meal_extra_notes;
            this.userMealPrefData.subscribepreference.meal_preference_setting = [];
            this.preferences.forEach(x => {
                x.options.forEach(y => {
                    if (y.is_selected) {
                        this.userMealPrefData.subscribepreference.meal_preference_setting.push({
                            question_id: y.preference_id,
                            option_id: y.preference_option_id,
                            qty: y.selected_qty
                        });
                    }
                })
            });
            this.loading = true;
            this.rest.saveItem(false, this.userMealPrefData, 'meal-settings').subscribe(res => {
                this.alert.success('User meal preference succesfully updated!');
                this.loading = false;
            }, e => {
                const err = e.json();
                this.loading = false;
                this.alert.error(err.message);
            })
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }

    displayOptionPrice(opt_price, prefIndex) {
        if(opt_price > 0) {
            return opt_price;
        }
    }

    ngOnDestroy() {
    }
}
