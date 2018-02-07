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
            this.selectedBillingAddress = null;
            this.newBillingAddress = false;
            this.rest.hideLoader();
            if (this.userData.addresses.length > 0) {
                this.userAddress = this.userData.addresses;
            }

            if (this.cartData.shippingAddress && this.cartData.shippingAddress.country_id) {
                this.sameAddress = this.cartData.shippingAddress.same_as_billing
            }
            
            if (this.cartData.billingAddress && this.cartData.billingAddress.country_id) {
                if (this.cartData.billingAddress.customer_address_id && this.userAddress.length > 0) {
                    let address = this.userAddress.find(x => x.id === this.cartData.billingAddress.customer_address_id);
                    if(address) {
                        this.selectAddress(address);
                    }
                } 
            } else if (this.userData.addresses.length > 0) {
                let address = this.userAddress.find(x => x.default_billing);
                if(address) {
                    this.selectAddress(address);
                }
            }
            if (!this.selectedBillingAddress || this.userData.addresses.length == 0) {
                this.addNewAddress();
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
            let ignoreFields = ['id', 'default_billing', 'default_shipping'];
            if (x === 'region') {
                Object.assign({}, selectedBillingAddress, address[x]);
            } else if(ignoreFields.indexOf(x) == -1) {
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
        this.newBillingAddress= true;
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
                this.saveBillingAddress();
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

    saveBillingAddress() {
        if (this.selectedBillingAddress) {
            let same_as_billing = this.sameAddress ? 1 : 0;
            this.selectedBillingAddress = Object.assign({}, this.selectedBillingAddress, {
                same_as_billing: same_as_billing,
                customer_id: this.userData.id
            });

            let formValues = {
                address: this.selectedBillingAddress,
                useForShipping: this.sameAddress
            };  
            this.rest.saveItem(false, formValues, 'carts/mine/billing-address').subscribe(res => {
                this.rest.hideLoader();
                this.next.emit('billing-address');
            }, e => {
                this.rest.hideLoader();
                this.loading = false;
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
        if(this.sameAddress) {
            this.next.emit('billing-address');
            return;
        }
        this.checkoutAddressSubmitted = true;
        this.rest.showLoader();
        if(this.newBillingAddress) {
            this.saveUserAddress();
        } else {
            this.saveBillingAddress();
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
