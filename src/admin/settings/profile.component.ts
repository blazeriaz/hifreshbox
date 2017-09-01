import { Component, OnInit, Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, RestService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

@Injectable()
export class profileEditResolve implements Resolve<any> {
  
  constructor(private rest: RestService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.rest.getItems(1,[],1000,"accountsettings/1","criteria");
  }
}

@Component({
    templateUrl: 'profile.component.html'
})
export class PofileFormComponent implements OnInit {
    mainForm:any;
    profile;
    submitted;

    constructor(
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder
    ) { }
    
    ngOnInit(): void {      
      this.profile = this.route.snapshot.data['profile'];
      this.mainForm = this._fb.group({
        user_id : 1,
        firstname : [this.profile[1], [Validators.required]],
        lastname : [this.profile[2], [Validators.required]],
        username : [this.profile[4], [Validators.required]],
        email : [this.profile[3], [Validators.required, Validators.email]],
        password : '',
        is_active : 1,
        interface_locale: 'en_US', 
      });
    }

    setInputErrorClass(input) {
      let invalid = this.mainForm.get(input).invalid && this.submitted;
      if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
      let invalid = this.mainForm.get(input).invalid && this.submitted;
      if(invalid) return 'has-danger';
    }

    saveProfile() {
      this.alert.clear();
      this.submitted = true;
      if (this.mainForm.valid) {          
          let sendData = this.mainForm.value;
          if(sendData.password == "") {
            delete sendData.password;
          }

          this.rest.saveItem("", {adminsettings : sendData}, "adminsettings").subscribe(
            data => {
                this.alert.success("The profile details saved successfully!", true);
                
            }
        );
      } else {
        this.alert.error("Please check the form to enter all required details");
        
      }
    }
}