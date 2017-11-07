import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService } from 'services';

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

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private _fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');

        this.checkoutMealForm = this._fb.group({
            howmuch_meals_week: 1,
            howmany_people: 1
        });

        this.rest.getItems(1, [], 1000, 'meals/search', 'criteria').subscribe(res => {
            this.preferences = res.items;
        });
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
            this.next.emit('meal');
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
