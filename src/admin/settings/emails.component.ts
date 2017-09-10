import { Component, OnInit, Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, RestService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

@Injectable()
export class emailsFormResolve implements Resolve<any> {
  
  constructor(private rest: RestService) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    return this.rest.getItems(1,[],1000,"emailinfomation","criteria");
  }
}

@Component({
    templateUrl: 'emails.component.html'
})
export class EmailsFormComponent implements OnInit {
    mainForm:any;
    emails;
    submitted;

    constructor(
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder
    ) { }
    
    ngOnInit(): void {      
      this.emails = this.route.snapshot.data['emails'];
      this.mainForm = this._fb.group({
        general_contact_name : [this.emails[0].name, [Validators.required]],
        general_contact_email : [this.emails[0].email, [Validators.required, Validators.email]],
        sales_representive_name : [this.emails[1].name, [Validators.required]],
        sales_representive_email : [this.emails[1].email, [Validators.required, Validators.email]],
        customer_support_name : [this.emails[2].name, [Validators.required]],
        customer_support_email : [this.emails[2].email, [Validators.required, Validators.email]]
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

    saveContactEmails() {
      this.alert.clear();
      this.submitted = true;
      if (this.mainForm.valid) {          
        this.rest.showLoader();
        let sendData = this.mainForm.value;
        this.rest.saveItem("", {email_address : sendData}, "emailupdate").subscribe(data => {
          this.alert.success("The profile details saved successfully!", true);
          this.rest.hideLoader();
        }, err => this.rest.hideLoader());
      } else {
        this.alert.error("Please check the form to enter all required details");
      }
    }
}
