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
    sameAddress = true;
    selectedShippingAddress = null;
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
                return;
            }
            this.cartData = data;
            
            this.needToLoaded.cart = true;
            this.checkAllLoaded();  
        }))
    }

    checkAllLoaded() {
        if(this.needToLoaded.region && this.needToLoaded.user && this.needToLoaded.cart) {
            this.selectedBillingAddress = null;
            this.newBillingAddress = false;
            
            this.selectedShippingAddress = this.checkCartAddressValid(this.cartData.shippingAddress);
            if(!this.selectedShippingAddress) {
                this.goBack();
                return;
            }
            this.sameAddress = this.cartData.shippingAddress.same_as_billing == 1 ? true : false;

            this.selectedBillingAddress = this.checkCartAddressValid(this.cartData.billingAddress);

            if(!this.selectedBillingAddress) {
                if(this.userData.addresses.length > 0) {
                    let address = this.userData.addresses.find(x => x.default_billing);
                    if(address) {
                        this.selectedBillingAddress = address;
                    }
                } else {
                    this.addNewAddress();
                }
            }
            this.rest.hideLoader();
        }        
    }

    setBillingAddressClass(address, i: number) {
        return {
            'bg-primary text-white' : this.selectedBillingAddress && this.selectedBillingAddress.id === address.id
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

    selectAddress(adddress) {
        this.newBillingAddress= false;
        this.selectedBillingAddress = adddress;
    }

    convertUserAddress(address) {
        let convertedAddress = {};
        convertedAddress['customer_address_id'] = address.id;        
        let ignoreFields = ['id', 'default_billing', 'default_shipping', 'region', 'region_id'];
        Object.keys(address).forEach(x => {
            if(ignoreFields.indexOf(x) == -1) {
                convertedAddress[x] = address[x];
            }
        });
        convertedAddress['customer_id'] = this.userData.id;
        convertedAddress['same_as_billing'] = this.sameAddress ? 1 : 0;
        return Object.assign({}, convertedAddress, address['region']);
    }

    toogleSameAsBilling() {
        this.sameAddress = !this.sameAddress;
        if(this.sameAddress) {
            this.saveShipBillAddress();
        }
    }

    checkCartAddressValid(address) {
        if (address && address.country_id) {
            if (address.customer_address_id && this.userData.addresses.length > 0) {
                let returnAddress = this.userData.addresses.find(x => x.id == address.customer_address_id);
                return returnAddress;
            }
        }
        return false;
    }

    saveShipBillAddress() {
        let shipping_address = this.selectedShippingAddress;
        let billing_address = this.selectedBillingAddress;
        let same_as_billing = this.sameAddress;
        if(same_as_billing) {
            billing_address = shipping_address;
        }
        let formValues = {
            shipping_address: this.convertUserAddress(shipping_address),
            billing_address: this.convertUserAddress(billing_address),
            shipping_carrier_code : 'tablerate',
            shipping_method_code : 'bestway'
        };
        const sendData = {addressInformation : formValues};
        this.rest.showLoader();
        this.rest.saveItem(false, sendData, 'carts/mine/shipping-information').subscribe(res => {
            this.rest.hideLoader();
            if(this.newBillingAddress) {
                this.auth.setUserInfo(this.userData);
            }
            this.next.emit('billing-address');
        }, e => {
            this.rest.hideLoader();
            if(this.newBillingAddress) {
                this.auth.setUserInfo(this.userData);
            }
            this.goBack();
            const err = e.json();
            if(err.message == 'Carrier with such method not found: %1, %2') {
                this.alert.error('We can\'t ship the order to your location');
            } else {                
                this.alert.error(err.message);
            }
        })
    }

    saveUserAddress() {
        if (this.checkoutAddressForm.valid) {
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
                this.userData = user;
                this.selectedBillingAddress = user.addresses[user.addresses.length - 1];
                this.saveShipBillAddress();
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

    saveCheckoutAddress() {
        this.alert.clear();              
        this.rest.showLoader();
        if(this.sameAddress) {
            this.saveShipBillAddress();
            return;
        }  
        if(this.newBillingAddress) {
            this.checkoutAddressSubmitted = true;
            this.saveUserAddress();
        } else {
            if(this.selectedBillingAddress) {
                this.saveShipBillAddress();
            } else {
                this.alert.error('Please select the billing address!');
                this.rest.hideLoader();
            }
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
