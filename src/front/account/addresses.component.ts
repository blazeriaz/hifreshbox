import { Component, OnInit, Injectable, ViewChild, TemplateRef, Renderer2, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService, RestService, AuthService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
    templateUrl: 'addresses.component.html'
})
export class AddressesComponent implements OnInit, OnDestroy {
    countries: any;
    available_regions: any;
    regionsAll: any;
    user: any;
    userForm: any;
    indexEditAddress: number = -1;
    indexDefaultAddress: number;
    submitted: boolean;
    saveLoading: boolean;

    doDeleteAddress: boolean;
    
    loadedFormData;
    countLoadedFormReqs;
    loadFormRequests;

    constructor(
        private usersService: UsersService,
        private alert: AlertService,
        private auth: AuthService,
        private rest: RestService,
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private renderer: Renderer2
    ) {
    }

    ngOnInit(): void {
        this.loadFormRequests = [];
        this.countLoadedFormReqs = 0;
        this.loadedFormData = false;
        this.loadCountries();
        this.loadFormData();
    }

    checkAllFormDataLoaded() {
      if (--this.countLoadedFormReqs === 0) {
        this.initEditForm();
        this.loadedFormData = true;
      }
    }

    loadCountries() {
        this.countries = [];
        this.regionsAll = [];
        this.available_regions = [];
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
                });
                this.checkAllFormDataLoaded();
            })
        );
        this.countLoadedFormReqs++;
    }

    loadFormData() {
        this.auth.getUserInfo().subscribe(user => {
            if (!user) {
                this.countLoadedFormReqs--;
                this.loadedFormData = false;
                this.auth.initLoggedInUserInfo();
            } else if (!user.loading) {
                this.user = user;
                this.checkAllFormDataLoaded();
            } 
        });
        this.countLoadedFormReqs++;
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
        this.submitted = true;
        if (this.userForm.valid) {
            this.saveLoading = true;
            this.rest.showLoader();
            this.rest.saveItem('me', {customer: this.userForm.value}, 'customers/me').subscribe(data => {
                this.auth.initLoggedInUserInfo();
                this.indexEditAddress = -1;
                if(this.doDeleteAddress) {
                    this.alert.success('The customer addressess have been deleted successfully!');
                } else {
                    this.alert.success('The customer addressess have been saved successfully!');
                }
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

    goToList() {
      this.router.navigate(['account']);
    }

    ngOnDestroy() {
    }
}
