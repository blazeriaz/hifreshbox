import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { RestService, AlertService, CartService, AuthService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'checkout-shipping-address',
    templateUrl: 'shipping.address.component.html'
})
export class ShippingAddressComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();

    @ViewChild('newAddress') public newAddress:ElementRef;

    cartData;
    userData;
    US_regions;
    UsregionsAll;
    checkoutAddressForm;
    checkoutAddressSubmitted;
    userAddress = [];
    loading;
    sameAddress = true;
    selectedShippingAddress = null;
    newShippingAddress = false;
    needToLoaded;
    needToDestroyEvents = [];


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
        }));

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
            this.selectedShippingAddress = null;
            this.newShippingAddress = false;
            this.sameAddress = true;
            this.rest.hideLoader();
            if (this.userData.addresses.length > 0) {
                this.userAddress = this.userData.addresses;
            }
            if (this.cartData.shippingAddress && this.cartData.shippingAddress.country_id) {
                if (this.cartData.shippingAddress.customer_address_id && this.userAddress.length > 0) {
                    let address = this.userAddress.find(x => x.id === this.cartData.shippingAddress.customer_address_id);
                    this.sameAddress = this.cartData.shippingAddress.same_as_billing;
                    if(address) {
                        this.selectAddress(address);
                    }
                } 
            } else if (this.userAddress.length > 0) {
                let address = this.userAddress.find(x => x.default_billing);
                if(address) {
                    this.selectAddress(address);
                }
            }console.log(this.selectedShippingAddress);
            if (!this.selectedShippingAddress || this.userData.addresses.length == 0) {
                this.addNewAddress();
            }
        }        
    }

    selectAddress(address) {
        this.newShippingAddress= false;
        let selectedShippingAddress = {};
        selectedShippingAddress['customer_address_id'] = address.id;
        Object.keys(address).forEach(x => {
            let ignoreFields = ['id', 'default_billing', 'default_shipping'];
            if (x === 'region') {
                Object.assign({}, selectedShippingAddress, address[x]);
            } else if(ignoreFields.indexOf(x) == -1) {
                selectedShippingAddress[x] = address[x];
            }
        });
        this.selectedShippingAddress = selectedShippingAddress;
    }

    setAddressClass(address, i: number) {
        return {
            'bg-primary text-white' : this.selectedShippingAddress && this.selectedShippingAddress.customer_address_id == address.id
        };
    }

    addNewAddress() {
        this.newShippingAddress= true;
        const newAddress = {
            firstname : this.userData.firstname,
            lastname : this.userData.lastname,
            email : this.userData.email,
            customer_id: this.userData.id,
            street: ['', ''],
            city: '',
            region: {
                region_code: null,
                region: null,
                region_id: 0
            },
            region_id: 0,
            country_id: 'US',
            postcode: '',
            telephone: ''
        };

        this.initAddressForm(newAddress);
    }

    initAddressForm(address) {
        this.checkoutAddressForm = this._fb.group({
            'customer_id': address.customer_id,
            'firstname': [address.firstname, Validators.required],
            'lastname': [address.lastname, [Validators.required]],
            'street': this._fb.array([
                new FormControl(address.street[0], Validators.required),
                new FormControl(address.street[1]?address.street[1]:'')
            ]),
            'city': address.city,
            'country_id': [address.country_id, [Validators.required]],
            'region_id': address.region_id,
            'region': this._fb.group({
                'region_id': (address.region)?address.region.region_id:'',
                'region_code': [(address.region)?address.region.region_code:'', Validators.required],
                'region': [(address.region)?address.region.region:'', Validators.required]
            }),
            'postcode' : [address.postcode, [Validators.required]],
            'telephone' : [address.telephone, [Validators.required, Validators.minLength(10)]],
            default_billing: false,
            default_shipping: false
        });
    }

    getActiveRegion() {
        const region_id = this.checkoutAddressForm.value.region_id;
        return this.US_regions.filter(x => x.id == region_id);
    }
    refreshRegionValue(selectedRegion) {
        let region = this.UsregionsAll.find(x => x.id == selectedRegion.id);
        this.checkoutAddressForm.patchValue({
            region_id : region.id,
            region : {
                region_id : region.id,
                region_code : region.code,
                region : region.name
            }
        });
    }

    setAddressInputClass(input) {
        const invalid = this.checkoutAddressForm.get(input).invalid;
        return (invalid && this.checkoutAddressSubmitted) ? 'form-control-danger' : '';
    }

    setAddressDivClass(input) {
        const invalid = this.checkoutAddressForm.get(input).invalid;
        return (invalid && this.checkoutAddressSubmitted) ? 'has-danger' : '';
    }

    saveUserAddress() {
        if (this.checkoutAddressForm.valid) {
            this.loading = true;
            let sentUserData = {
                'id': this.userData.id,
                'store_id': 1,
                'website_id': 1,
                'firstname': this.userData.firstname,
                'lastname': this.userData.lastname,
                'email': this.userData.email,
                'gender': this.userData.gender,
                'addresses' : this.userData.addresses
            };
            sentUserData.addresses.push(this.checkoutAddressForm.value);
            this.rest.saveItem('me', {customer: sentUserData}, 'customers/me').subscribe(user => {
                this.auth.setUserInfo(user);
                this.selectAddress(user.addresses[user.addresses.length - 1]);
                this.saveShippingAddress();
            }, e => {
                const err = e.json();
                this.alert.error(err.message);
                this.rest.hideLoader();
            });
        } else {
            this.alert.error('Please check the form to enter all required details');
            this.rest.hideLoader();
        }
    }

    saveShippingAddress() {
        if (this.selectedShippingAddress) {
            let same_as_billing = this.sameAddress ? 1 : 0;
            this.selectedShippingAddress = Object.assign({}, this.selectedShippingAddress, {
                same_as_billing: same_as_billing,
                customer_id: this.userData.id
            });

            let formValues = {
                shipping_address: this.selectedShippingAddress,
                billing_address: this.selectedShippingAddress,
                shipping_carrier_code : 'tablerate',
                shipping_method_code : 'bestway'
            };
            if(!same_as_billing && this.cartData.billingAddress && this.cartData.billingAddress.country_id) {
                delete formValues.billing_address;
            }
            const sendData = {addressInformation : formValues};            
            this.rest.saveItem(false, sendData, 'carts/mine/shipping-information').subscribe(res => {
                this.rest.hideLoader();
                if(same_as_billing == 1) {
                    this.next.emit('billing-address');
                } else {
                    this.next.emit('shipping-address');
                }
            }, e => {
                this.rest.hideLoader();
                const err = e.json();
                this.alert.error(err.message);
            })
        } else {
            this.rest.hideLoader();
            this.alert.error('Please select the address for shipping!');
        }
    }

    saveCheckoutAddress() {
        this.alert.clear();
        this.checkoutAddressSubmitted = true;
        this.rest.showLoader();
        if(this.newShippingAddress) {
            this.saveUserAddress();
        } else {
            this.saveShippingAddress();
        }
    }

    goBack() {
        this.back.emit('shipping-address');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
