import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService, CartService, MealMenuService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { CreditCardValidator } from 'angular-cc-library';
import { error } from 'selenium-webdriver';

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
    needToDestroyEvents = [];

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

        this.needToDestroyEvents.push(this.cartService.getCartTotal().subscribe(data => {
            if (!data.cart || !data.cart.loading) {
                return;
            }
            this.cart = data.cart;
            this.showImages = data.showImages;
            this.mealCartItem = data.mealCartItem;
            this.totals = data.totals;
            this.billingAddress = data.billingAddress;
            this.shippingAddress = data.shippingAddress;
        }))
        
        this.newCard = true;
        this.needToDestroyEvents.push(this.rest
            .getItem(1, 'payment/listcreditcard')
            .subscribe(cards => {
                this.newCard = cards.length === 0;
                this.cards = cards.map(x => {
                    x.details = JSON.parse(x.details);
                    if(x.is_default == 1) {
                        this.selectPaymentCard(x);
                    }
                    return x;
                });
        }))

        this.currentMenuDays = this.mealMenuService.getCurrentMenuDays();
    }

    selectPaymentCard(card) {
        card.cvc = '';
        this.selectedCard = card;
        this.newCard = false;
    }

    setInputClass(input) {
        const invalid = this.checkoutPaymentForm.get(input).invalid;
        return (invalid && this.checkoutPaymentSubmitted) ? 'form-control-danger' : '';
    }

    setInputDivClass(input) {
        const invalid = this.checkoutPaymentForm.get(input).invalid;
        return (invalid && this.checkoutPaymentSubmitted) ? 'has-danger' : '';
    }

    addNewCard() {
        this.selectedCard=null;
        this.newCard=1;
        this.checkoutPaymentForm.reset();
    }    

    saveCheckoutPayment() {
        this.alert.clear();
        if(this.selectedCard) {
            this.loading = true;
            this.savePaymentInfoHash(this.selectedCard.public_hash);
            return;
        }
        this.checkoutPaymentSubmitted = true;
        if (this.checkoutPaymentForm.valid) {
            const mon_yr = this.checkoutPaymentForm.value.card_month_year.split("/");
            const data = {
                customer_id: this.cart.customer.id,
                card_number: this.checkoutPaymentForm.value.card_number,
                month: mon_yr[0].trim(),
                year: mon_yr[1].trim(),
                cvv: this.checkoutPaymentForm.value.card_cvv,
            }
            this.rest.showLoader();
            this.rest.addCrditCard(data).subscribe(public_hash => {
                if(public_hash.substring(0, 5).toLowerCase() === 'error') {
                    this.rest.hideLoader();
                    this.alert.error(public_hash);
                } else {
                    this.savePaymentInfoHash(public_hash)
                }
            }, err => {
                this.rest.hideLoader();
                this.alert.error(err);
            });
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }

    savePaymentInfoHash(public_hash) {
        const data = {
            'public_hash': public_hash
        };
        this.rest.saveItem(false, data, 'payment/getpaymentnonce').subscribe(res => {
            this.cartService.setPaymentInfo({
                payment_method_nonce: res,
                public_hash: public_hash,
                is_active_payment_token_enabler: true
            });
            this.rest.hideLoader();
            this.next.emit('payment');
            this.loading = false;
        }, err => {
            this.rest.hideLoader();
            this.loading = false;
            this.alert.error('Please check with administrator');
        }); 
    }

    goBack() {
        this.back.emit('payment');
    }

    goCheckoutStep(step) {
        this.goStep.emit(step);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
