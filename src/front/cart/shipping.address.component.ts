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

        this.checkoutAddressForm = this._fb.group({
            shipping_address: this.addNewAddress(),
            shipping_carrier_code : 'tablerate',
            shipping_method_code : 'bestway'
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
            this.checkoutAddressForm.controls['shipping_address'].patchValue({
                firstname : user.firstname,
                lastname : user.lastname,
                email : user.email
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
            this.selectedShippingAddress = null;
            this.newShippingAddress = false;
            this.rest.hideLoader();
            if (this.userData.addresses.length > 0) {
                this.userAddress = this.userData.addresses;
            }
            
            if (this.cartData.shippingAddress && this.cartData.shippingAddress.country_id) {                
                if (this.cartData.shippingAddress.customer_address_id && this.userAddress.length > 0) {
                    let address = this.userAddress.find(x => x.id === this.cartData.shippingAddress.customer_address_id);
                    if(address) {
                        this.selectAddress(address);
                    }
                } 
                if (!this.selectedShippingAddress) {
                    delete this.cartData.shippingAddress.customer_address_id;
                    this.checkoutAddressForm.controls['billing_address'].patchValue(this.cartData.shippingAddress);
                }
            } else if (this.userData.addresses.length > 0) {
                let address = this.userAddress.find(x => x.default_billing);
                if(address) {
                    this.selectAddress(address);
                }
            }
            if (!this.selectedShippingAddress || this.userData.addresses.length == 0) {
                this.newShippingAddress = true;
            }

            if(this.newShippingAddress) {
                setTimeout(()=>this.newAddress.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' }))
            }
        }        
    }

    selectAddress(address) {
        this.newShippingAddress= false;
        let selectedShippingAddress = {};
        selectedShippingAddress['customer_address_id'] = address.id;
        Object.keys(address).forEach(x => {
            if (x === 'region') {
                Object.assign({}, selectedShippingAddress, address[x]);
            } else if(x != 'id') {
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
        const newAddress = {
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
            'save_in_address_book': 1
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

    saveCheckoutAddress() {
        this.checkoutAddressSubmitted = true;
        this.alert.clear();
        if (this.selectedShippingAddress) {
            this.checkoutAddressForm.controls['shipping_address'].patchValue(this.selectedShippingAddress);
        }
        let same_as_billing = this.sameAddress ? 1 : 0;
        this.checkoutAddressForm.controls['shipping_address'].patchValue({
            same_as_billing: same_as_billing,
            customer_id: this.userData.id
        });
        
        if (!this.checkoutAddressForm.errors) {
            this.loading = true;
            this.rest.showLoader();
            const formValues = this.checkoutAddressForm.value;
            if (this.newShippingAddress) {
                delete formValues['shipping_address'].customer_address_id;
                formValues['shipping_address'].save_in_address_book = 1;
            } else {
                formValues['shipping_address'].save_in_address_book = 0;
            }       
            const sendData = {addressInformation : formValues};
            this.rest.saveItem(false, sendData, 'carts/mine/shipping-information').subscribe(res => {
                this.rest.hideLoader();
                this.next.emit('shipping-address');
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
        this.back.emit('shipping-address');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
        this.needToDestroyEvents.forEach(x => x ? x.unsubscribe() : '');
    }
}
