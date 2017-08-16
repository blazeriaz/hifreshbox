import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService } from "services";
import { FormBuilder, Validators } from "@angular/forms";

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
    user:any;
    countries:any;
    countriesAll:any;
    userForm: any;
    editAddress:any;
    addressInfos: Object;

    constructor(private usersService: UsersService, 
                private alert: AlertService,
                private formBuilder: FormBuilder,
                private route: ActivatedRoute ) {
        this.user = {firstname:'', lastname: '', email: '', gender:''};

        this.editAddress = null;

        this.userForm = this.formBuilder.group({
            'firstname': ['', Validators.required],
            'lastname': ['', [Validators.required]],
            'email': ['', [Validators.required, Validators.email]],
            'gender': ['', [Validators.required]],
            'addresses' : this.formBuilder.group({
                'afirstname': ['', Validators.required],
                'alastname': ['', [Validators.required]],
                'street0': ['', [Validators.required]],
                'street1': ['', []],
                'city': ['', []]
            })
        });
    }
    
    
    ngOnInit(): void { 
        let userId = this.route.snapshot.params['id'];
        if(userId) {
            this.user = this.route.snapshot.data['user'];
        }
        this.countries = [];
        this.usersService.getCountries().subscribe(
            data => {                
                this.countriesAll = data;
                this.countries = data.map(data=>{
                    return {id: data.id, text: data.full_name_locale};
                });
            }
        );
    }
    
    refreshCountryValue(country) {
        console.log(country);
    }

    doEditAddress(address) {
        address.selectedCountry = {};
        if(address.country_id) {
            address.selectedCountry = this.countries.filter(x => x.id == address.country_id)[0];
        }
        address.edit = 1;
        this.editAddress = address;
    }

    initNewAddress() {
        this.user.addresses.push({
            firstname: this.user.firstname, 
            lastname: this.user.lastname, 
            street: [], 
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
        });
        let len = this.user.addresses.length;
        this.doEditAddress(this.user.addresses[len-1]);
    }

    setAddressClass(address) {
        return {
            'bg-primary text-white' : address.default_shipping,
            'bg-faded text-white' : (address.delete == 1),
            'bg-warning text-white' : (address.edit == 1)
        };
    }

    setDefaultAddress(address) {
        if(confirm('Are you sure want to change default Address?')) {
            this.user.addresses.map(data => {
                data.default_billing = (data == address);
                data.default_shipping = (data == address);
            });
        }
    }

    saveUser() {
        this.alert.clear();
        let userId = this.route.snapshot.params['id'];
        userId = (userId)?userId:'';
        let customerSave = {...this.userForm.value, storeId: 1, websiteId: 1};
        this.usersService.saveUser(userId, {customer: customerSave}).subscribe(
            data => {
                this.user = data;
            }
        );
    }
}
