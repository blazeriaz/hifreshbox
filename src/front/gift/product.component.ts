import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from 'global';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: 'product.component.html'
})
export class ProductComponent implements OnInit, OnDestroy {
    backgrounds;
    giftProduct;
    quoteId;
    step = 1;
    customOptions = [];
    recipientForm;
    submitted;
    sentData;
    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private renderer: Renderer2,
        private _fb: FormBuilder
    ) { }

    ngOnInit(): void {
        // this.renderer.addClass(document.body, 'white-header');

        this.backgrounds = {
            header: {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'top-banner-week-menu.png)',
                'background-position' : 'bottom',
                'background-size': 'cover',
                'background-attachment' : 'fixed',
                'background-color' : '#2F2F30'
            },
            recipe : GlobalVariable.htmlImages + 'each-recipe-img.png',
            cap : GlobalVariable.htmlImages + 'chef-cap-green.png',
            culinery : GlobalVariable.htmlImages + 'culinery.png',
            whatfreshbox : GlobalVariable.htmlImages + 'what-is-freshbox.png',
            gray : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'hiw-bg.png)',
                'background-position' : 'bottom',
                'background-color' : '#DFDFDF',
                'background-size': 'cover',
            },
            testimonials : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'testimonials.png)',
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

        this.giftProduct = {cart_item: {
            quote_id: null,
            sku: 'freshbox-gift',
            qty: 1,
            productOption: null
        }};

        this.setProductOption(13, 23);
        this.setProductOption(14, 27);

        this.rest.saveItem(false, {}, 'carts/mine').subscribe(res => {
            this.quoteId = res;
            this.giftProduct.cart_item.quote_id = res;
        });

        this.recipientForm = this._fb.group({
            'your_name': ['', Validators.required],
            'recipient_firstname': ['', Validators.required],
            'recipient_lastname': ['', [Validators.required]],
            'recipient_email': ['', [Validators.required, Validators.email]],
            'message': ['Because you like cooking so much and i like eating :)', Validators.required]
        });
    }

    addGiftToCart() {
        this.submitted = true;
        this.sentData = true;
        this.alert.clear();
        if (this.recipientForm.valid) {
            this.setProductOption(15, this.recipientForm.value.your_name);
            this.setProductOption(16, this.recipientForm.value.recipient_firstname);
            this.setProductOption(17, this.recipientForm.value.recipient_lastname);
            this.setProductOption(18, this.recipientForm.value.recipient_email);
            this.setProductOption(19, this.recipientForm.value.message);
            this.giftProduct.cart_item.productOption =  {
                extensionAttributes: {
                    customOptions: this.customOptions
                }
            };
            this.rest.saveItem(false, this.giftProduct, 'carts/mine/items').subscribe(res => {
                this.sentData = false;
                this.alert.success('Gift added to cart');
                this.router.navigate(['/', 'cart']);
            }, err => {
                this.sentData = false;
                const e = err.json();
                this.alert.error(e.message);
            });
        } else {
            this.sentData = false;
            this.alert.error('Please check the form to enter all required details');
        }
    }

    setInputErrorClass(input) {
        const field = this.recipientForm.get(input);
        const invalid = field.invalid && this.submitted;
        if (invalid) {
            return 'form-control-danger';
        }
    }

    setContainerErrorClass(input) {
        const field = this.recipientForm.get(input);
        const invalid = field.invalid && this.submitted;
        if (invalid) {
            return 'has-danger';
        }
    }

    increseQty() {
        this.giftProduct.cart_item.qty++;
    }

    decreseQty() {
        if (this.giftProduct.cart_item.qty <= 1) {
            this.giftProduct.cart_item.qty = 1;
        } else {
            this.giftProduct.cart_item.qty--;
        }
    }

    setProductOption(id, value) {
        const oIndex = this.customOptions.findIndex(x => x.optionId === id);
        if (oIndex === -1) {
            this.customOptions.push({
                optionId: id,
                optionValue: value
            });
        } else {
            this.customOptions[oIndex].optionValue = value;
        }
    }

    getOptionButtonClass(id, value) {
        const oIndex = this.customOptions.findIndex(x => x.optionId === id);
        if (oIndex !== -1 && this.customOptions[oIndex].optionValue === value) {
            return 'btn-success';
        } else {
            return 'btn-secondary bg-light';
        }
    }

    goToPrevStep() {
        this.step = 1;
        this.renderer.removeClass(document.body, 'white-header');
    }

    goToNextStep() {
        this.step = 2;
        this.submitted = false;
        this.renderer.addClass(document.body, 'white-header');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
