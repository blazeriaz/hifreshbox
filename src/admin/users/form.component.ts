import { Component, OnInit, Injectable, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService, RestService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'form.component.html'
})
export class UserFormComponent implements OnInit {
    @ViewChild('savemodal') saveModal: TemplateRef<any>;
    @ViewChild('editLoadModal') editLoadModal: TemplateRef<any>;

    countries: any;
    available_regions: any;
    regionsAll: any;
    user: any;
    userForm: any;
    indexEditAddress: number;
    indexDefaultAddress: number;
    submitted: boolean;

    updatingMessage;
    saveModalClose;
    abortModalClose;
    saveRequests;
    public modalRef: BsModalRef;
    modalEditRef: BsModalRef;
    serverMediaImages;
    loadedFormData;
    countLoadedFormReqs;
    loadFormRequests;

    constructor(
        private usersService: UsersService,
        private alert: AlertService,
        private rest: RestService,
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService
    ) {}

    ngOnInit(): void {
        this.user = {};
        this.loadFormRequests = [];
        this.countLoadedFormReqs = 0;
        this.loadedFormData = false;
        this.openEditModal();
        this.loadCountries();
        this.loadFormData();
    }

    openEditModal() {
      this.modalEditRef = this.modalService.show(this.editLoadModal, {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      });
    }

    abortEdit() {
      if (this.loadFormRequests && this.loadFormRequests.length > 0) {
        this.loadFormRequests.map(sub => sub ? sub.unsubscribe() : '');
      }
      this.modalEditRef.hide();
      this.goToList();
    }

    checkAllFormDataLoaded() {
      if (--this.countLoadedFormReqs === 0) {
        this.modalEditRef.hide();
        this.initEditForm();
        this.loadedFormData = true;
      }
    }

    loadCountries() {
        this.countries = [];
        this.regionsAll = [];
        this.available_regions = [];
        this.loadFormRequests.push(
            this.rest.getItems(1, [], 1000, 'directory/countries').subscribe(res => {
                res.filter(data => {
                    this.available_regions[data.id] = null
                    if (data.available_regions) {
                        this.available_regions[data.id] = [];
                        data.available_regions.filter(region => {
                            this.regionsAll.push(region);
                            this.available_regions[data.id].push(
                                {id: region.id, text: region.name}
                            );
                        });
                    }
                    this.countries.push({id: data.id, text: data.full_name_locale});
                });
                this.checkAllFormDataLoaded();
            })
        );
        this.countLoadedFormReqs++;
    }

    loadFormData() {
        const userId = this.route.snapshot.params['id'];
        if (!userId) {
            return;
        }
        this.user = {
            id: userId
        };
        this.loadFormRequests.push(
            this.rest.getItem(userId, 'customers/' + userId).subscribe(user => {
                this.user = user;
                this.checkAllFormDataLoaded();
            })
        );
        this.countLoadedFormReqs++;
    }

    initEditForm() {
        const user = this.user ? this.user : {};
        this.userForm = this._fb.group({
            'id': user.id,
            'store_id': 1,
            'website_id': 1,
            'firstname': [user.firstname, Validators.required],
            'lastname': [user.lastname, [Validators.required]],
            'email': [user.email, [Validators.required, Validators.email]],
            'gender': user.gender,
            'addresses' : this._fb.array([])
        });

        let doAddNewAddress = true;
        if (user.id) {
            this.user.addresses.map((address, i) => {
                if (address.default_shipping) {
                    this.indexDefaultAddress = i;
                }
                this.userForm.controls['addresses'].push(this.initAddressForm(address));
            });
            if (this.user.addresses.length > 0) {
                doAddNewAddress = false;
                this.doEditAddress(0);
            }
        }
        if (doAddNewAddress) {
            this.addNewAddress();
            this.setDefaultAddress(0, true);
        }

        this.userForm.valueChanges.subscribe(data => {
            if (!this.indexEditAddress) {
                return;
            }

            const region_id = data.addresses[this.indexEditAddress].region_id;
            const region_name = data.addresses[this.indexEditAddress].region.region;

            if (region_id === 0) {
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
            'telephone' : [address.telephone, [Validators.required]],
            'default_shipping' : address.default_shipping,
            'default_billing' : address.default_billing
        });
    }

    getActiveCountry() {
        const country_id = this.userForm.value.addresses[this.indexEditAddress].country_id;
        return this.countries.filter(x => x.id === country_id);
    }

    getActiveCountryRegions() {
        const country_id = this.userForm.value.addresses[this.indexEditAddress].country_id;
        return this.available_regions[country_id];
    }

    getActiveRegion() {
        const regions = this.getActiveCountryRegions();
        if (!regions) {
            return;
        }
        const region_id = this.userForm.value.addresses[this.indexEditAddress].region_id;
        return regions.filter(x => x.id == region_id);
    }

    refreshCountryValue(country) {
        this.patchAddressValue(this.indexEditAddress, {country_id : country.id});
    }
    refreshRegionValue(selectedRegion) {
        const region = this.regionsAll.find(x => x.id === selectedRegion.id);
        this.patchAddressValue(this.indexEditAddress, {
            region_id : region.id,
            region : {
                region_id : region.id,
                region_code : region.code,
                region : region.name
            }
        });
    }

    setAddressClass(i: number) {
        return {
            'bg-primary text-white' : this.indexDefaultAddress === i,
            'bg-warning text-white' : this.indexEditAddress === i,
            'bg-danger text-white' : this.submitted && this.userForm.controls.addresses.controls[i].invalid,
        };
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
        if (this.getGender() === type) {
            return 'bg-primary';
        } else {
            return 'bg-secondary';
        }
    }

    setInputErrorClass(input) {
        const invalid = this.userForm.get(input).invalid && this.submitted;
        return (invalid) ? 'form-control-danger' : '';
    }

    setContainerErrorClass(input) {
        const invalid = this.userForm.get(input).invalid && this.submitted;
        return (invalid) ? 'has-danger' : '';
    }

    setAddressInputClass(input) {
        const invalid = this.userForm.controls['addresses'].controls[this.indexEditAddress].get(input).invalid;
        return (invalid && this.submitted) ? 'form-control-danger' : '';
    }

    setAddressDivClass(input) {
        const invalid = this.userForm.controls['addresses'].controls[this.indexEditAddress].get(input).invalid;
        return (invalid && this.submitted) ? 'has-danger' : '';
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
        }
    }

    doEditAddress(i: number) {
        this.indexEditAddress = i;
    }

    deleteAddress(i: number) {
        if (i === this.indexDefaultAddress) {
            alert('You can\'t delete the default address');
            return;
        }
        if (confirm('Are you sure want to delete the address?')) {
            this.userForm.controls['addresses'].removeAt(i);
            this.doEditAddress(0);
        }
    }

    addNewAddress() {
        const user = this.user ? this.user : {};
        const newAddress = {
            id: 0,
            customer_id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
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

        this.userForm.controls['addresses'].push(this.initAddressForm(newAddress));
        this.doEditAddress(this.userForm.controls['addresses'].controls.length - 1);
    }

    noticeUserSaved = function() {
        this.updatingMessage = 'The customer details have been saved successfully!'; 
        this.saveModalClose = true;
        this.abortModalClose = false;
    }

    saveUser() {
        this.alert.clear();
        this.submitted = true;
        if (this.userForm.valid) {
            let userId = this.route.snapshot.params['id'];
            userId = (userId) ? userId : '';

            this.updatingMessage = 'Uploading the Customer information...';
            this.saveModalClose = false;
            this.abortModalClose = true;
            this.openSaveModal();
            this.saveRequests = [];

            let sendData = {
                customer: this.userForm.value
            };
            this.rest.saveItem(userId, sendData, 'customers/' + userId).subscribe(data => {
                this.noticeUserSaved();
            }, err => {
                const error = err.json();
                this.saveModalClose = true;
                this.abortModalClose = false;
                this.modalRef.hide();
                this.alert.error(error.message);
                window.scroll(0, 0);
            });
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }

    openSaveModal() {
      this.modalRef = this.modalService.show(this.saveModal, {
        animated: true,
        keyboard: false,
        backdrop: true,
        ignoreBackdropClick: true
      });
    }

    abortSave() {
      if (this.saveRequests && this.saveRequests.length > 0) {
        this.saveRequests.map(sub => sub ? sub.unsubscribe() : '');
      }
      this.modalRef.hide();
    }

    goToList() {
      this.router.navigate(['users']);
    }
}
