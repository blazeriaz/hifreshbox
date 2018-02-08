import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService, CartService, AuthService } from 'services';

import * as GlobalVariable from 'global';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  templateUrl: 'product.component.html'
})
export class ProductComponent implements OnInit, OnDestroy {
    backgrounds;
    giftItem;
    giftProduct;
    step = 1;
    customOptions = [];
    recipientForm;
    submitted;
    sentData;
    constructor(
        private alert: AlertService,
        private auth: AuthService,
        private rest: RestService,
        private router: Router,
        private renderer: Renderer2,
        private _fb: FormBuilder,
        private cartService: CartService
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

        this.giftProduct = {cartItem: {
            quote_id: null,
            sku: 'freshbox-gift',
            qty: 1,
            productOption: null
        }};

        this.cartService.getCartTotal().subscribe(res => {
            if (res.guestCardId) {
                this.giftProduct.cartItem.quote_id = res.guestCardId
            } else if (res.cart && res.cart.id) {
                this.giftProduct.cartItem.quote_id = res.cart.id
            }
        });

        this.recipientForm = this._fb.group({
            'your_name': ['', Validators.required],
            'recipient_firstname': ['', Validators.required],
            'recipient_lastname': ['', [Validators.required]],
            'recipient_email': ['', [Validators.required, Validators.email]],
            'message': ['Because you like cooking so much and i like eating :)', Validators.required]
        });

        this.auth.getUserInfo().subscribe(user => {
            if (user && user.loading) {
                this.recipientForm.patchValue({
                    your_name: user.firstname + ' ' + user.lastname
                });
            } 
        });

        this.giftItem = {};
        this.rest.showLoader();
        this.rest.getItem('freshbox-gift', 'recipedetail/' + 'freshbox-gift').subscribe(gift => {
            this.giftItem = gift;
            this.rest.getItem('freshbox-gift', 'products/' + 'freshbox-gift').subscribe(gift1 => {
                this.giftItem.options = gift1.options;
                this.giftItem.dropDownOptions = gift1.options.filter(x => x.type === 'drop_down');
                this.giftItem.dropDownOptions.forEach(x => {
                    this.setProductOption(x.option_id, x.values[0].option_type_id);
                });
                this.rest.hideLoader();
            }, e => this.rest.hideLoader());
        }, e => this.rest.hideLoader());
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
            this.giftProduct.cartItem.productOption =  {
                extensionAttributes: {
                    customOptions: this.customOptions
                }
            };
            this.rest.showLoader();
            this.cartService.addItemToCart(this.giftProduct).subscribe(res => {
                this.sentData = false;
                this.alert.success('Gift added to cart');
                this.cartService.increaseCartItem(res);
                this.rest.hideLoader();
                this.router.navigate(['/', 'cart']);
            }, err => {
                this.sentData = false;
                const e = err.json();
                this.alert.error(e.message);
                this.rest.hideLoader();
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
        this.giftProduct.cartItem.qty++;
    }

    decreseQty() {
        if (this.giftProduct.cartItem.qty <= 1) {
            this.giftProduct.cartItem.qty = 1;
        } else {
            this.giftProduct.cartItem.qty--;
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
        window.scroll(0, 0);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
