import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { RestService, AlertService, CartService, AuthService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'checkout-billing-address',
    templateUrl: 'billing.address.component.html'
})
export class BillingAddressComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();
    @ViewChild('newAddress') public newAddress:ElementRef;
    
    cartData;
    US_regions;
    UsregionsAll;
    checkoutAddressForm;
    checkoutAddressSubmitted;
    userAddress = [];
    loading;
    sameAddress = true;
    selectedBillingAddress = null;
    newBillingAddress = false;
    needToLoaded;
    needToDestroyEvents = [];
    userData;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private _fb: FormBuilder,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.loading = true;
        this.US_regions = [];
        this.UsregionsAll = [];
        this.needToLoaded = {
            'region': false,
            'user': false,
            'cart': false
        };
        this.rest.showLoader();
        this.needToDestroyEvents.push(this.rest.getItems(1, [], 1000, 'directory/countries/US').subscribe(country => {
            if (country.available_regions) {
                country.available_regions.filter(region => {
                    this.UsregionsAll.push(region);
                    this.US_regions.push(
                        {id: region.id, text: region.name}
                    );
                });
            }
            this.needToLoaded.region = true;
            this.checkAllLoaded();
        }))

        this.checkoutAddressForm = this._fb.group({
            address: this.addNewAddress(),
            useForShipping : true
        });

        this.needToDestroyEvents.push(this.auth.getUserInfo().subscribe(user => {
            if (!user) {
                this.auth.initLoggedInUserInfo();
                return;
            }
            if(user.loading) {
                this.needToLoaded.user = false;
                this.loading = true;
                return;
            }
            this.userData = user;
            this.checkoutAddressForm.controls['address'].patchValue({
                firstname : user.firstname,
                lastname : user.lastname,
                email : user.email,
                customer_id: user.id
            });      
            this.needToLoaded.user = true;
            this.checkAllLoaded();   
        }))

        this.needToDestroyEvents.push(this.cartService.getCartTotal().subscribe(data => {
            if (!data.cart) {
                return;
            }
            if(data.cart.loading) {
                this.needToLoaded.cart = false;
                this.loading = true;
                return;
            }
            this.cartData = data;
            
            this.needToLoaded.cart = true;
            this.checkAllLoaded();  
        }))
    }

    checkAllLoaded() {
        if(this.needToLoaded.region && this.needToLoaded.user && this.needToLoaded.cart) {
            this.loading = false;
            this.userAddress = [];
            this.selectedBillingAddress = null;
            this.newBillingAddress = false;
            this.rest.hideLoader();
            if (this.userData.addresses.length > 0) {
                this.userAddress = this.userData.addresses;
            }
            
            if (this.cartData.billingAddress && this.cartData.billingAddress.country_id) {
                if (this.cartData.billingAddress.customer_address_id && this.userAddress.length > 0) {
                    let address = this.userAddress.find(x => x.id === this.cartData.billingAddress.customer_address_id);
                    if(address) {
                        this.selectAddress(address);
                    }
                } 
                if (!this.selectedBillingAddress) {
                    delete this.cartData.billingAddress.customer_address_id;
                    this.checkoutAddressForm.controls['address'].patchValue(this.cartData.billingAddress);
                }
            } else if (this.userData.addresses.length > 0) {
                let address = this.userAddress.find(x => x.default_billing);
                if(address) {
                    this.selectAddress(address);
                }
            }
            if (!this.selectedBillingAddress || this.userData.addresses.length == 0) {
                this.newBillingAddress = true;
            }

            if(this.newBillingAddress) {
                setTimeout(()=>this.newAddress.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' }))
            }
        }        
    }

    selectAddress(address) {
        this.newBillingAddress= false;
        let selectedBillingAddress = {};
        selectedBillingAddress['customer_address_id'] = address.id;
        Object.keys(address).forEach(x => {
            if (x === 'region') {
                Object.assign({}, selectedBillingAddress, address[x]);
            } else if(x != 'id') {
                selectedBillingAddress[x] = address[x];
            }
        });
        this.selectedBillingAddress = selectedBillingAddress;
    }

    setBillingAddressClass(address, i: number) {
        return {
            'bg-primary text-white' : this.selectedBillingAddress && this.selectedBillingAddress.customer_address_id === address.id
        };
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
            same_as_billing: 1,
            save_in_address_book: 1
        };

        return this.initAddressForm(newAddress);
    }

    initAddressForm(address) {
        return this._fb.group({
            'customer_address_id': '',
            'customer_id': '',
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
            'save_in_address_book': 1//address.save_in_address_book
        });
    }

    getActiveRegion(form) {
        const region_id = this.checkoutAddressForm.controls[form].value.region_id;
        return this.US_regions.filter(x => x.id == region_id);
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

    toogleSameAsBilling() {
        this.sameAddress = !this.sameAddress;
        if(this.sameAddress) {
            let tmp = Object.assign({}, this.selectedBillingAddress);
            if (this.cartData.shippingAddress && this.cartData.shippingAddress.country_id) {
                if (this.cartData.shippingAddress.customer_address_id && this.userAddress.length > 0) {
                    let address = this.userAddress.find(x => x.id === this.cartData.shippingAddress.customer_address_id);
                    if(address) {
                        this.selectAddress(address);
                    }
                }
                if (!this.selectedBillingAddress) {
                    delete this.cartData.shippingAddress.customer_address_id;
                    this.selectedBillingAddress = Object.assign({}, this.cartData.shippingAddress);
                }
                let address = Object.assign({}, this.selectedBillingAddress, {same_as_billing: 1});
                this.selectedBillingAddress = Object.assign({}, tmp);
                let formValues = {
                    shipping_address: address,
                    billing_address: address,
                    shipping_carrier_code : 'tablerate',
                    shipping_method_code : 'bestway'
                };
                const sendData = {addressInformation : formValues};
                this.rest.showLoader();
                this.rest.saveItem(false, sendData, 'carts/mine/shipping-information').subscribe(res => {
                    this.rest.hideLoader();
                    this.next.emit('billing-address');
                    this.cartService.setCartTotal(true);
                }, e => {
                    this.rest.hideLoader();
                    this.goBack();
                    const err = e.json();
                    this.alert.error(err.message, true);
                })
            } else {
                this.goBack();
                return;
            }
        }
    }

    saveCheckoutAddress() {
        this.checkoutAddressSubmitted = true;
        this.alert.clear();
        if(this.sameAddress) {
            return;
        }
        if (this.selectedBillingAddress) {
            this.checkoutAddressForm.controls['address'].patchValue(this.selectedBillingAddress);
        }

        let same_as_billing = this.sameAddress ? 1 : 0;
        this.checkoutAddressForm.patchValue({
            useForShipping: same_as_billing
        });
        this.checkoutAddressForm.controls['address'].patchValue({
            same_as_billing: same_as_billing,
            customer_id: this.userData.id
        });
        if (!this.checkoutAddressForm.errors) {
            this.loading = true;
            this.rest.showLoader();
            const formValues = this.checkoutAddressForm.value;
            if (this.newBillingAddress) {
                delete formValues['address'].customer_address_id;
                formValues['address'].save_in_address_book = 1;
            } else {
                formValues['address'].save_in_address_book = 0;
            }  
            this.rest.saveItem(false, formValues, 'carts/mine/billing-address').subscribe(res => {
                this.rest.hideLoader();
                this.next.emit('billing-address');
                this.cartService.setCartTotal(true);
            }, e => {
                this.rest.hideLoader();
                this.loading = false;
                const err = e.json();
                this.alert.error(err.message);
            })
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }

    goBack() {
        this.back.emit('billing-address');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
