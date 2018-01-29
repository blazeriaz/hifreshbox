import { Component, OnInit, Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { ProductsService, AlertService, RestService, UsersService } from "services";
import { FormBuilder, Validators, FormArray } from "@angular/forms";

@Component({
    templateUrl: 'others.component.html'
})
export class OthersFormComponent implements OnInit {
    forms:any = [];
    submitted;

    constructor(
      private usersService: UsersService,
      private rest: RestService,
      private alert: AlertService,
      private route: ActivatedRoute,
      private router: Router,
      private _fb : FormBuilder
    ) { }
    
    ngOnInit(): void {      
      this.forms['mailchimp'] = this._fb.group({
        api_key : ['', [Validators.required]],
        list_id : ['', [Validators.required]]
      });
      this.forms['social_info'] = this._fb.group({
        facebook : ['', [Validators.required]],
        twitter : ['', [Validators.required]],
        instagram : ['', [Validators.required]],
        pinterest : ['', [Validators.required]]
      });
    }

    setInputErrorClass(form, input) {
      let invalid = form.get(input).invalid && this.submitted;
      if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(form, input) {
      let invalid = form.get(input).invalid && this.submitted;
      if(invalid) return 'has-danger';
    }

    saveMailChimpInfo() {
      this.alert.clear();
      this.submitted = true;
      let form = this.forms['mailchimp'];
      if (form.valid) {
        let sendData = form.value;
        this.rest.showLoader();
        this.rest.saveItem("", {mailchimp : sendData}, "update-mail-chimp").subscribe(data => {
            this.alert.success("The mailchimp details saved successfully!", false, 'mailchimp');
            this.rest.hideLoader();
        }, err => this.rest.hideLoader());
      } else {
        this.alert.error("Please check the form to enter all required details", false, 'mailchimp');
      }
    }
    saveSocialInfo() {
      this.alert.clear();
      this.submitted = true;
      let form = this.forms['social_info'];
      if (form.valid) {
        let sendData = form.value;
        this.rest.showLoader();
        this.rest.saveItem("", {social : sendData}, "update-social-follow").subscribe(data => {
            this.alert.success("The social follow details saved successfully!", false, 'social_info');
            this.rest.hideLoader();
        }, err => this.rest.hideLoader());
      } else {
        this.alert.error("Please check the form to enter all required details", false, 'social_info');
      }
    }
}
