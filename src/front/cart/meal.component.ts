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
    cartMealProduct;
    mealMenuProduct;
    customOptions: Array<any>;
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
            howmuch_meals_week: this._fb.group({
                optionId: '',
                optionValue: [3, [Validators.required]]
            }),
            howmany_people: this._fb.group({
                optionId: '',
                optionValue: [2, [Validators.required]]
            }),
            meal_extra_notes: this._fb.group({
                optionId: '',
                optionValue: ['', [Validators.required]]
            })
        });

        /**this.MealProduct = {cart_item: {
            quote_id: null,
            product_id: 2078,
            qty: 1,
            preferences: null,
            howmuch_meals_week: 3,
            howmany_people: 2,
            meal_extra_notes: 1
        }};**/

        this.mealMenuProduct = {cartItem: {
            quote_id: null,
            itemId: null,
            sku: 'freshbox-subscription',
            qty: 1,
            productOption: null
        }};
        this.rest.showLoader();
        this.needToDestroyEvents.push(this.cartService.getCartTotal().subscribe(data => {            
            this.customOptions = [];
            if(!data.cart || data.cart.loading || data.cart.mealPreferenceLoading) {
                return;
            }
            if (data.guestCardId) {
                this.mealMenuProduct.cartItem.quote_id = data.guestCardId
            } else if (data.cart && data.cart.id) {
                this.mealMenuProduct.cartItem.quote_id = data.cart.id
            }
            if (data.mealCartItem) {
                const formValues = {};
                this.mealMenuProduct.cartItem.itemId = data.mealCartItem.item_id;
                data.cartMealProduct.options.forEach((proOpt, optIndex) => {
                    if(proOpt.values && proOpt.values.length > 0) {
                        proOpt.values.filter(x => x.selected).forEach(optVal => {
                            this.setProductOption(proOpt, optVal.option_type_id, true);
                        });
                    } else if(proOpt.option_value) {
                        this.setProductOption(proOpt, proOpt.option_value);
                    }
                    if(proOpt.title == 'how much meals week') {
                        formValues['howmuch_meals_week'] = {
                            optionId: proOpt.option_id,
                            optionValue: proOpt.option_value
                        };
                    }
                    if(proOpt.title == 'how many people') {
                        formValues['howmany_people'] = {
                            optionId: proOpt.option_id,
                            optionValue: parseInt(proOpt.option_value, 10)
                        };
                    }
                    if(proOpt.title == 'meal extra notes') {
                        formValues['meal_extra_notes'] = {
                            optionId: proOpt.option_id,
                            optionValue: proOpt.option_value ? proOpt.option_value: ''
                        };
                    }
                });
                this.cartMealProduct = data.cartMealProduct;
                /**data.mealPreferences.forEach((x, i) => {
                    if (i === 0) {
                        this.preferences = x;
                    } else {
                        Object.keys(x).forEach((key) => {
                            formValues[key] = parseInt(x[key], 10) ? parseInt(x[key], 10) : x[key];
                        });
                    }
                });**/
                this.checkoutMealForm.patchValue(formValues);
                this.rest.hideLoader();
            }
        }))
    }

    setProductOption(opt, value, ignore = false) {
        const optIndex = this.customOptions.findIndex(x => x.optionId === opt.option_id);        
        if(opt.values && opt.values.length > 0) {
            if(opt.type == 'radio' && !ignore) {
                opt.values.forEach(x => x.selected = false);
            }
            const proOptVal = opt.values.find(x => x.option_type_id == value);
            if(proOptVal && !ignore) {
                proOptVal.selected = (opt.type == 'radio' && opt.is_require) ? true : !proOptVal.selected;
            }
            const selectedFilters = opt.values.filter(x => x.selected);
            if(selectedFilters.length == 0) {
                this.customOptions.splice(optIndex, 1);
            } else {
                const selectedValues = selectedFilters.map(x => x.option_type_id).join(",");
                if (optIndex === -1) {
                    this.customOptions.push({
                        optionId: opt.option_id,
                        optionValue: selectedValues
                    });
                } else {
                    this.customOptions[optIndex].optionValue = selectedValues;
                }
            }
        } else if (optIndex === -1) {
            this.customOptions.push({
                optionId: opt.option_id,
                optionValue: value
            });
        } else {
            this.customOptions[optIndex].optionValue = value;
        }
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
        const invalid = this.checkoutMealForm.get(input).get('optionValue').invalid;
        return (invalid && this.checkoutMealSubmitted) ? 'form-control-danger' : '';
    }

    setInputDivClass(input) {
        const invalid = this.checkoutMealForm.get(input).get('optionValue').invalid;
        return (invalid && this.checkoutMealSubmitted) ? 'has-danger' : '';
    }

    saveCheckoutMeal() {
        this.checkoutMealSubmitted = true;
        this.alert.clear();
        if (this.checkoutMealForm.valid) {
            /**this.MealProduct.cart_item.howmuch_meals_week = 3;//this.checkoutMealForm.value.howmuch_meals_week,
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
            });**/
            Object.keys(this.checkoutMealForm.value).forEach(key => {
                const opt = this.checkoutMealForm.value[key];
                if(opt.optionValue) {
                    const proOpt = this.cartMealProduct.options.find(x => x.option_id == opt.optionId);
                    this.setProductOption(proOpt, opt.optionValue);
                }
            });
            this.mealMenuProduct.cartItem.productOption =  {
                extensionAttributes: {
                    customOptions: this.customOptions
                }
            };
            this.loading = true;
            this.rest.showLoader();
            if(this.checkoutMealForm.value.howmany_people.optionValue) {
                this.mealMenuProduct.cartItem.qty = parseInt(this.checkoutMealForm.value.howmany_people.optionValue, 10) / 2;
            }
            this.cartService.addItemToCart(this.mealMenuProduct).subscribe(res => {
            //this.cartService.addMealToCart(this.MealProduct).subscribe(res => {
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

    displayOptionPrice(opt_price, prefIndex) {
        if(opt_price > 0) {
            return opt_price;
        }
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
