import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'checkout-payment',
    templateUrl: 'payment.component.html'
})
export class PaymentComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();

    checkoutPaymentForm;
    checkoutPaymentSubmitted;
    loading;

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
        this.loading = false;
        this.checkoutPaymentForm = this._fb.group({
            'cart_holder_name': ['', [Validators.required]],
            'cart_number': ['', [Validators.required]],
            'cart_month': ['', [Validators.required]],
            'cart_year': ['', [Validators.required]],
            'cart_cvv': ['', [Validators.required]]
        });
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

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
