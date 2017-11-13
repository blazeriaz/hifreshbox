import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService, CartService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'checkout-address',
    templateUrl: 'address.component.html'
})
export class AddressComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();

    cart;
    totals;
    US_regions;
    UsregionsAll;
    checkoutAddressForm;
    checkoutAddressSubmitted;
    loading;
    sameAddress = true;

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
        this.US_regions = [];
        this.UsregionsAll = [];
        this.rest.getItems(1, [], 1000, 'directory/countries/US').subscribe(country => {
            if (country.available_regions) {
                country.available_regions.filter(region => {
                    this.UsregionsAll.push(region);
                    this.US_regions.push(
                        {id: region.id, text: region.name}
                    );
                });
            }
        })

        this.rest.getItem('me', 'customers/me').subscribe(user => {
            this.checkoutAddressForm.controls['shipping_address'].patchValue({
                firstname : user.firstname,
                lastname : user.lastname,
                email : user.email
            });
            this.checkoutAddressForm.controls['billing_address'].patchValue({
                firstname : user.firstname,
                lastname : user.lastname,
                email : user.email
            });
        })

        this.checkoutAddressForm = this._fb.group({
            shipping_address: this.addNewAddress(),
            billing_address: this.addNewAddress(),
            shipping_carrier_code : 'tablerate',
            shipping_method_code : 'bestway'
        });

        this.cartService.getCartTotal().subscribe(data => {
            if (!data.cart) {
                return;
            }
            this.cart = data.cart;
            this.totals = data.totals;
            if (data.billingAddress) {
                this.sameAddress = data.billingAddress.same_as_billing;
                this.checkoutAddressForm.controls['billing_address'].patchValue(data.billingAddress);
            }
            if (data.shippingAddress) {
                this.sameAddress = data.shippingAddress.same_as_billing;
                this.checkoutAddressForm.controls['shipping_address'].patchValue(data.shippingAddress);
            }
        });
    }

    addNewAddress() {
        const newAddress = {
            id: 0,
            customer_id: 0,
            firstname: '',
            lastname: '',
            email: '',
            street: ['', ''],
            city: '',
            region_code: null,
            region: null,
            region_id: 0,
            country_id: 'US',
            postcode: '',
            telephone: '',
            same_as_billing: 0,
            save_in_address_book: 0
        };

        return this.initAddressForm(newAddress);
    }

    initAddressForm(address) {
        return this._fb.group({
            'firstname': [address.firstname, Validators.required],
            'lastname': [address.lastname, [Validators.required]],
            'street': this._fb.array([
                new FormControl(address.street[0], Validators.required),
                new FormControl(address.street[1] ? address.street[1] : '')
            ]),
            'email': address.email,
            'city': address.city,
            'country_id': [address.country_id, [Validators.required]],
            'region_id': (address.region) ? address.region.region_id : '',
            'region_code': [(address.region) ? address.region.region_code : '', Validators.required],
            'region': [(address.region) ? address.region.region : '', Validators.required],
            'postcode' : [address.postcode, [Validators.required]],
            'telephone' : [address.telephone, [Validators.required]],
            'same_as_billing': address.same_as_billing,
            'save_in_address_book': address.save_in_address_book
        });
    }

    getActiveRegion(form) {
        const region_id = this.checkoutAddressForm.controls[form].value.region_id;
        return this.US_regions.filter(x => x.id === region_id);
    }

    refreshRegionValue(form, selectedRegion) {
        const region = this.UsregionsAll.find(x => x.id === selectedRegion.id);
        this.checkoutAddressForm.controls[form].patchValue({
            region_id : region.id,
            region_code : region.code,
            region : region.name
        });
    }

    setAddressInputClass(input, form) {
        const invalid = this.checkoutAddressForm.controls[form].get(input).invalid;
        return (invalid && this.checkoutAddressSubmitted) ? 'form-control-danger' : '';
    }

    setAddressDivClass(input, form) {
        const invalid = this.checkoutAddressForm.controls[form].get(input).invalid;
        return (invalid && this.checkoutAddressSubmitted) ? 'has-danger' : '';
    }

    saveCheckoutAddress() {
        this.checkoutAddressSubmitted = true;
        this.alert.clear();
        if (this.sameAddress) {
            this.checkoutAddressForm.controls['shipping_address'].patchValue({
                same_as_billing: 1
            });
            this.checkoutAddressForm.controls['billing_address'].patchValue(
                this.checkoutAddressForm.controls['shipping_address'].value
            );
        }
        if (this.checkoutAddressForm.valid) {
            this.loading = true;
            const sendData = {addressInformation : this.checkoutAddressForm.value};
            this.rest.saveItem(false, sendData, 'carts/mine/shipping-information').subscribe(res => {
                this.next.emit('address');
                this.cartService.setCartTotal(true);
            }, e => {
                this.loading = false;
                const err = e.json();
                this.alert.error(err.message);
            })
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }

    goBack() {
        this.back.emit('address');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
