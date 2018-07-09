import { Component, OnInit, Injectable, ViewChild, TemplateRef, Renderer2, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService, CartService, RestService, AuthService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
    selector: 'checkout-billing-address',
    templateUrl: 'billing.address.component.html'
})
export class BillingAddressComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();
    cartData;
    countries: any;
    available_regions: any;
    regionsAll: any;
    user: any;
    userForm: any;
    indexEditAddress: number = -1;
    indexDefaultAddress: number;
    submitted: boolean;
    saveLoading: boolean;
    dataLoading;

    doDeleteAddress: boolean;
    
    loadedFormData;
    loadFormRequests;

    sameAddress = true;
    selectedShippingAddress = null;
    selectedBillingAddress = null;

    constructor(
        private usersService: UsersService,
        private alert: AlertService,
        private rest: RestService,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,        
        private _fb: FormBuilder,        
        private cartService: CartService
    ) {
    }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.loadFormRequests = [];
        this.loadedFormData = false;
        this.dataLoading = {
            country: false,
            user: false,
            cart: false
        };
        this.rest.showLoader();
        this.loadCountries();
        this.loadFormData();
    }

    checkAllFormDataLoaded() {
      if (this.dataLoading.country && this.dataLoading.user && this.dataLoading.cart) {
        this.initEditForm();        
        this.loadedFormData = true;
        this.rest.hideLoader();

        this.selectedShippingAddress = null;
        this.selectedBillingAddress = null;
        this.selectedShippingAddress = this.checkCartAddressValid(this.cartData.shippingAddress);
        this.selectedBillingAddress = this.checkCartAddressValid(this.cartData.billingAddress);

        this.sameAddress = true;
        if(this.selectedShippingAddress && this.selectedBillingAddress) {
            this.sameAddress = this.cartData.shippingAddress.same_as_billing == 1 ? true : false;
        }
        if(!this.selectedBillingAddress) {                
            if(this.user.addresses.length > 0) {
                let address = this.user.addresses.find(x => x.default_billing);
                if(address) {
                    this.selectedBillingAddress = address;
                }
            } else {
                this.addNewAddress();
            }
        }
      }
    }

    setAddressClass(address, i: number) {
        return {
            'bg-primary text-white' : this.selectedBillingAddress && this.selectedBillingAddress.id == address.id
        };
    }

    checkCartAddressValid(address) {
        if (address && address.country_id) {
            if (address.customer_address_id && this.user.addresses.length > 0) {
                let returnAddress = this.user.addresses.find(x => x.id == address.customer_address_id);
                return returnAddress;
            }
        }
        return false;
    }

    selectAddress(adddress) {
        this.doDeleteAddress = false;
        this.indexEditAddress = -1;
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
        convertedAddress['customer_id'] = this.user.id;
        convertedAddress['same_as_billing'] = this.sameAddress ? 1 : 0;
        return Object.assign({}, convertedAddress, address['region']);
    }

    loadCountries() {
        this.countries = [];
        this.regionsAll = [];
        this.available_regions = [];
        this.dataLoading.country = false;
        this.loadFormRequests.push(
            this.rest.getItems(1, [], 1000, 'directory/countries').subscribe(countries => {
                countries.filter(country => {
                    this.available_regions[country.id] = null
                    if (country.available_regions) {
                        this.available_regions[country.id] = [];
                        country.available_regions.filter(region => {
                            this.regionsAll.push(region);
                            this.available_regions[country.id].push(
                                {id: region.id, text: region.name}
                            );
                        });
                    }
                    this.countries.push({id: country.id, text: country.full_name_locale});
                    this.dataLoading.country = true;
                });
                this.checkAllFormDataLoaded();
            })
        );
    }

    loadFormData() {
        this.dataLoading.user = false;
        this.auth.getUserInfo().subscribe(user => {
            if (!user) {
                this.loadedFormData = false;
                this.auth.initLoggedInUserInfo();
            } else if (!user.loading) {
                this.user = user;
                this.dataLoading.user = true;
                this.checkAllFormDataLoaded();
            } 
        });
        this.cartService.getCartTotal().subscribe(data => {
            if (!data.cart) {
                return;
            }
            if(data.cart.loading) {
                this.dataLoading.cart = false;
                return;
            }
            this.cartData = data;
            
            this.dataLoading.cart = true;
            this.checkAllFormDataLoaded();
        })
        
    }

    initEditForm() {
        this.userForm = this._fb.group({
            'id': this.user.id,
            'store_id': 1,
            'website_id': 1,
            'firstname': this.user.firstname,
            'lastname': this.user.lastname,
            'email': this.user.email,
            'gender': this.user.gender,
            'addresses' : this._fb.array([])
        });

        if (this.user.id) {
            this.user.addresses.map((address, i) => {
                if (address.default_shipping) {
                    this.indexDefaultAddress = i;
                }
                this.userForm.controls['addresses'].push(this.initAddressForm(address));
            });
        }

        this.userForm.valueChanges.subscribe(data => {
            if (!this.indexEditAddress || !data.addresses[this.indexEditAddress]) return;

            let region_id = data.addresses[this.indexEditAddress].region_id;
            let region_name = data.addresses[this.indexEditAddress].region.region;

            if (region_id == 0) {
                this.patchAddressValue(this.indexEditAddress, {
                    region_id : 0,
                    region : {
                        region_id : 0,
                        region_code : region_name,
                        region : region_name
                    }
                });
            }
        });
    }

    initAddressForm(address) {
        return this._fb.group({
            'id': address.id,
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
            'default_shipping' : address.default_shipping,
            'default_billing' : address.default_billing
        });
    }

    getActiveCountry() {
        let country_id = this.userForm.value.addresses[this.indexEditAddress].country_id;
        return this.countries.filter(x => x.id == country_id);
    }

    getActiveCountryRegions() {
        let available_regions = this.available_regions[this.userForm.value.addresses[this.indexEditAddress].country_id];
        return available_regions;
    }

    getActiveRegion() {
        let regions = this.getActiveCountryRegions();
        if (!regions) return;        
        let region_id = this.userForm.value.addresses[this.indexEditAddress].region_id;
        return regions.filter(x => x.id == region_id);
    }

    refreshCountryValue(country) {
        this.patchAddressValue(this.indexEditAddress, {country_id : country.id});
    }
    refreshRegionValue(selectedRegion) {
        let region = this.regionsAll.find(x => x.id == selectedRegion.id);
        this.patchAddressValue(this.indexEditAddress, {
            region_id : region.id,
            region : {
                region_id : region.id,
                region_code : region.code,
                region : region.name
            }
        });
    }

    setGender(gender) {
        this.userForm.patchValue({gender : gender});
    }

    getGender() {
        return this.userForm.value.gender;
    }

    patchAddressValue(i: number, values: object) {
        if (this.userForm.controls['addresses'].controls[i]) {
            this.userForm.controls['addresses'].controls[i].patchValue(values);
        }
    }

    setGenderClass(type) {
        if (this.getGender() == type) {
            return 'bg-primary';
        } else {
            return 'bg-secondary';
        }
    }

    setInputErrorClass(input) {
        const invalid = this.userForm.get(input).invalid;
        return (invalid) ? 'form-control-danger' : '';
    }

    setContainerErrorClass(input) {
        const invalid = this.userForm.get(input).invalid;
        return (invalid) ? 'has-danger' : '';
    }

    setAddressInputClass(input) {
        const invalid = this.userForm.controls['addresses'].controls[this.indexEditAddress].get(input).invalid;
        return (invalid) ? 'form-control-danger' : '';
    }

    setAddressDivClass(input) {
        const invalid = this.userForm.controls['addresses'].controls[this.indexEditAddress].get(input).invalid;
        return (invalid) ? 'has-danger' : '';
    }

    setDefaultAddress(i: number, first?) {
        if (first || confirm('Are you sure want to change default Address?')) {
            if (!this.indexDefaultAddress) {
                this.patchAddressValue(this.indexDefaultAddress, {
                    default_shipping : null,
                    default_billing : null
                });
            }
            this.indexDefaultAddress = i;
            this.patchAddressValue(this.indexDefaultAddress, {
                default_shipping : true,
                default_billing : true
            });
            this.saveUser();
        }
    }

    doEditAddress(i: number) {
        this.submitted = false;
        this.indexEditAddress = i;
    }

    deleteAddress(i: number) {
        if (confirm('Are you sure want to delete the address?')) {
            this.userForm.controls['addresses'].removeAt(i);
            this.doDeleteAddress = true;
            this.saveUser();
        }
    }

    addNewAddress() {
        if(this.saveLoading) {
            return;
        }
        const newAddress = {
            id: 0,
            customer_id: this.user.id,
            firstname: this.user.firstname,
            lastname: this.user.lastname,
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
        this.submitted = false;

        this.userForm.controls['addresses'].push(this.initAddressForm(newAddress));
        this.doEditAddress(this.userForm.controls['addresses'].controls.length - 1);
    }

    cancelSave() {
        if(this.userForm.controls['addresses'].controls[this.indexEditAddress].value.id == 0) {
            this.userForm.controls['addresses'].removeAt(this.indexEditAddress);
        }        
        this.indexEditAddress = -1;
        this.auth.initLoggedInUserInfo();
    }

    saveUser() {
        this.alert.clear();
        if(!this.doDeleteAddress && this.indexEditAddress === -1) {
            this.saveShipBillAddress();
            return;
        }
        this.submitted = true;
        if (this.userForm.valid) {
            this.saveLoading = true;
            this.rest.showLoader();
            this.rest.saveItem('me', {customer: this.userForm.value}, 'customers/me').subscribe(user => {
                this.user = user;
                this.auth.setUserInfo(user);
                if(this.doDeleteAddress) {
                    this.alert.success('The customer addresses have been deleted successfully!');
                    if(this.user.addresses.length == 0) {
                        this.addNewAddress();
                    }
                } else {                    
                    this.selectedBillingAddress = user.addresses[this.indexEditAddress];
                    this.saveShipBillAddress();
                }                
                this.indexEditAddress = -1;
                this.saveLoading = false;
                this.doDeleteAddress = false;
                this.rest.hideLoader();
            }, e => {
                const err = e.json();
                this.alert.error(err.message);
                this.saveLoading = false
                this.doDeleteAddress = false;
                this.rest.hideLoader();
            });
        } else {
            this.alert.error('Please check the form to enter all required details');
            this.doDeleteAddress = false;
        }
    }

    saveShipBillAddress() {
        let shipping_address = this.selectedShippingAddress;
        let billing_address = this.selectedBillingAddress;
        let same_as_billing = this.sameAddress;
        if(!shipping_address) {
            this.alert.error('Please select the address for shipping!');
            this.rest.hideLoader();
            return;
        }
        if(same_as_billing || !shipping_address) {
            shipping_address = billing_address;
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
            this.next.emit('billing-address');
        }, e => {
            this.rest.hideLoader();
            const err = e.json();
            if(err.message == 'Carrier with such method not found: %1, %2') {
                this.alert.error('We can\'t ship the order to your location');
            } else {                
                this.alert.error(err.message);
            }
        })
    }

    goBack() {
        this.back.emit('shipping-address');
    }

    ngOnDestroy() {
    }
}
