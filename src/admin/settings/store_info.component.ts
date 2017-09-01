import { Component, OnInit, Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, RestService, UsersService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

@Injectable()
export class storeFormResolve implements Resolve<any> {
  
  constructor(private rest: RestService) {}
  
  resolve() {
    return this.rest.getItem('',"siteinfomation");
  }
}

@Component({
    templateUrl: 'store_info.component.html'
})
export class StoreFormComponent implements OnInit {
    mainForm:any;
    store;
    submitted;
    countries;
    regionsAll;
    available_regions;

    constructor(
      private usersService: UsersService,
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder
    ) { }
    
    ngOnInit(): void {      
      this.store = this.route.snapshot.data['store'];
      this.countries = [];
      this.available_regions = [];
      this.regionsAll = [];
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
      this.mainForm = this._fb.group({
        name : [this.store[0], [Validators.required]],
        phone : [this.store[1], [Validators.required]],
        hours : [this.store[2], [Validators.required]],
        country_id : [this.store[3], [Validators.required]],
        region_id : [this.store[4], [Validators.required]],
        postcode : [this.store[5], [Validators.required]],
        city : [this.store[6], [Validators.required]],
        street_line1 : [this.store[7], [Validators.required]],
        street_line2 : this.store[8]
      });
    }

    getActiveCountry() {
        let country_id = this.mainForm.value.country_id;
        return this.countries.filter(x => x.id == country_id);
    }

    refreshCountryValue(country) {
      this.mainForm.patchValue({country_id : country.id});
    }

    refreshRegionValue(selectedRegion) {
        let region = this.regionsAll.find(x => x.id == selectedRegion.id);
        this.mainForm.patchValue({
            region_id : region.id,
            region : {
                region_id : region.id,
                region_code : region.code,
                region : region.name
            }
        });
    }

    getActiveCountryRegions() { 
        let available_regions = this.available_regions[this.mainForm.value.country_id];        
        available_regions = available_regions?available_regions:[];
        return available_regions;
    }

    getActiveRegion() {
        let regions = this.getActiveCountryRegions();
        if(!regions) return;        
        let region_id = this.mainForm.value.region_id;
        return regions.filter(x => x.id == region_id);
    }

    setInputErrorClass(input) {
      let invalid = this.mainForm.get(input).invalid && this.submitted;
      if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
      let invalid = this.mainForm.get(input).invalid && this.submitted;
      if(invalid) return 'has-danger';
    }

    saveStoreInfo() {
      this.alert.clear();
      this.submitted = true;
      if (this.mainForm.valid) {          
          let sendData = this.mainForm.value;

          this.rest.saveItem("", {email_address : sendData}, "emailupdate").subscribe(
            data => {
                this.alert.success("The profile details saved successfully!", true);
                
            }
        );
      } else {
        this.alert.error("Please check the form to enter all required details");
        
      }
    }
}
