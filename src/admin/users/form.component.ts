import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService } from "services";
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from "@angular/forms";

@Injectable()
export class customerEditResolve implements Resolve<any> {
  
  constructor(private usersService: UsersService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    let userId = route.params['id'];
    return this.usersService.getUser(userId);
  }
}

@Component({
    templateUrl: 'form.component.html'
})
export class UserFormComponent implements OnInit {
    countries:any;
    available_regions : any;
    regionsAll:any;
    user:any;
    userForm: any;
    indexEditAddress : number;
    indexDefaultAddress : number;
    submitted:boolean;

    constructor(private usersService: UsersService, 
                private alert: AlertService,
                private _fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router ) {
        this.countries = [];
        this.regionsAll = [];
        this.available_regions = [];
        this.usersService.getCountries().subscribe(
            data => {
                data.filter(data => {
                    this.available_regions[data.id] = null
                    if(data.available_regions) {
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
            }
        );        
    }

    initUserForm(user) {
        this.userForm = this._fb.group({
            'id': this.user.id,
            'store_id': 1, 
            'website_id': 1,
            'firstname': [this.user.firstname, Validators.required],
            'lastname': [this.user.lastname, [Validators.required]],
            'email': [this.user.email, [Validators.required, Validators.email]],
            'gender': this.user.gender,
            'addresses' : this._fb.array([])
        });
        this.userForm.valueChanges.subscribe(data => {
            if(!this.indexEditAddress) return;

            let region_id = data.addresses[this.indexEditAddress].region_id;
            let region_name = data.addresses[this.indexEditAddress].region.region;

            if(region_id == 0) {
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
    
    ngOnInit(): void {
        let userId = this.route.snapshot.params['id'];
        this.user = (userId)?this.route.snapshot.data['user']:{};
        this.initUserForm(this.user);
        if(userId) {            
            this.user.addresses.map((address, i) => {
                if(address.default_shipping) {
                    this.indexDefaultAddress = i;
                }
                this.userForm.controls['addresses'].push(this.initAddressForm(address));
            });
            this.doEditAddress(0);
        } else {
            this.addNewAddress();
            this.setDefaultAddress(0, true);
        }
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
        if(!regions) return;        
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

    setAddressClass(i: number) {
        return {            
            'bg-primary text-white' : this.indexDefaultAddress == i,
            'bg-warning text-white' : this.indexEditAddress == i,
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
        if(this.userForm.controls['addresses'].controls[i])
            this.userForm.controls['addresses'].controls[i].patchValue(values);
    }

    setGenderClass(type) {
        if(this.getGender() == type) {
            return 'bg-primary';
        } else {
            return 'bg-secondary';
        }
    }

    setInputErrorClass(input) {
        let invalid = this.userForm.get(input).invalid && this.submitted;
        if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
        let invalid = this.userForm.get(input).invalid && this.submitted;
        if(invalid) return 'has-danger';
    }

    setAddressInputClass(input) {
        let invalid = this.userForm.controls['addresses'].controls[this.indexEditAddress].get(input).invalid;
        if(invalid && this.submitted) return 'form-control-danger';
    }

    setAddressDivClass(input) {
        let invalid = this.userForm.controls['addresses'].controls[this.indexEditAddress].get(input).invalid;
        if(invalid && this.submitted) return 'has-danger';
    }

    setDefaultAddress(i: number, first?) {
        if(first || confirm('Are you sure want to change default Address?')) {
            if(!this.indexDefaultAddress) {
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
        if(i == this.indexDefaultAddress) {
            alert("You can't delete the default address");
            return;
        }
        if(confirm('Are you sure want to delete the address?')) {
            this.userForm.controls['addresses'].removeAt(i);
            this.doEditAddress(0);
        }
    }

    addNewAddress() {
        const newAddress = {
            id: 0,
            customer_id: this.user.id,
            firstname: this.user.firstname, 
            lastname: this.user.lastname, 
            street: ['', ''], 
            city: "", 
            region: {
                region_code: null, 
                region: null, 
                region_id: 0
            },
            region_id: 0,
            country_id: "US",  
            postcode: "",
            telephone: ""
        };

        this.userForm.controls['addresses'].push(this.initAddressForm(newAddress));
        this.doEditAddress(this.userForm.controls['addresses'].controls.length - 1);
    }

    saveUser() {
        this.alert.clear();
        this.submitted = true;
        if (this.userForm.valid) {                   
            let userId = this.route.snapshot.params['id'];
            userId = (userId)?userId:'';
            this.usersService.saveUser(userId, {customer: this.userForm.value}).subscribe(
                data => {
                    this.alert.success("The customer details are saved successfully!", true);
                    this.router.navigate(['users']);                    
                }
            );
        } else {
            this.alert.error("Please check the form to enter all required details");
            
        }
    }
}
