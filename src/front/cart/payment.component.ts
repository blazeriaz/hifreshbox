import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService, CartService, MealMenuService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { CreditCardValidator } from 'angular-cc-library';

@Component({
    selector: 'checkout-payment',
    templateUrl: 'payment.component.html'
})
export class PaymentComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();
    @Output() goStep = new EventEmitter();

    checkoutPaymentForm;
    checkoutPaymentSubmitted;
    loading;

    cart;
    totals;
    showImages;
    cards = [];
    mealCartItem;
    billingAddress;
    shippingAddress;
    currentMenuDays;
    newCard;
    selectedCard;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private _fb: FormBuilder,
        private cartService: CartService,
        private mealMenuService: MealMenuService
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.loading = false;
        this.checkoutPaymentForm = this._fb.group({
            'card_holder_name': ['', [Validators.required]],
            'card_number': ['', [Validators.required]],
            'card_month_year': ['', [CreditCardValidator.validateExpDate]],
            'card_cvv': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]]
        });

        this.cartService.getCartTotal().subscribe(data => {
            if (!data.cart) {
                return;
            }
            this.cart = data.cart;
            this.showImages = data.showImages;
            this.mealCartItem = data.mealCartItem;
            this.totals = data.totals;
            this.billingAddress = data.billingAddress;
            this.shippingAddress = data.shippingAddress;
        });

        const filters = [];
        const sortCards = [{
            field: 'created_at',
            direction: 'DESC'
        }];

        this.newCard = true;
        this.rest
            .getItems(1, filters, 1000, 'payment/listcreditcard', 'criteria', sortCards)
            .subscribe(cards => {
                this.newCard = cards.length === 0;
                this.cards = cards.map(x => {
                    x.details = JSON.parse(x.details);
                    return x;
                });
        });

        this.currentMenuDays = this.mealMenuService.getCurrentMenuDays();
    }

    selectPaymentCard(card) {
        this.selectedCard = card;
    }

    setInputClass(input) {
        const invalid = this.checkoutPaymentForm.get(input).invalid;
        return (invalid && this.checkoutPaymentSubmitted) ? 'form-control-danger' : '';
    }

    setInputDivClass(input) {
        const invalid = this.checkoutPaymentForm.get(input).invalid;
        return (invalid && this.checkoutPaymentSubmitted) ? 'has-danger' : '';
    }

    saveCheckoutPayment() {
        this.checkoutPaymentSubmitted = true;
        this.alert.clear();
        if (this.checkoutPaymentForm.valid) {
            this.next.emit('payment');
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }

    goBack() {
        this.back.emit('payment');
    }

    goCheckoutStep(step) {
        this.goStep.emit(step);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
