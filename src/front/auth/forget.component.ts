import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from "services/auth.service";
import { AlertService, RestService } from "services";
import { AlertComponent } from "components";

@Component({
  templateUrl: 'forget.component.html'
})
export class ForgetComponent implements OnInit {
  forgetForm: any;
  loading = false;
  returnUrl: string;
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private formBuilder: FormBuilder,
              private alert: AlertService,
              private rest: RestService) { 
    this.forgetForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }

  sendForgetEmail() {
    this.alert.clear();
    if (this.forgetForm.valid) {
      this.rest.showLoader();
      const sendData = {
        email : this.forgetForm.value.email,
        template : 'email_reset',
        websiteId : 1
      };
      this.rest.saveItem(1, sendData, 'customers/password').subscribe(
        data => {
          this.rest.hideLoader();
          this.alert.success('Please check your mail to reset the password', true);
          this.goToLogin();
        },
        error => {
          this.alert.error('We can\'t proceed your request.');
          this.rest.hideLoader();
        });
    } else {
      this.alert.error('Please enter correct email address');
    }
  }

}
