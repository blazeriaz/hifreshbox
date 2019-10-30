import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from "services/auth.service";
import { AlertService, RestService } from "services";
import { AlertComponent } from "components";

@Injectable()
export class checkRestTokenResolve implements Resolve<any> {

  constructor(private rest: RestService, private alert: AlertService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const sendData  = {
      id: route.params.customerId,
      token: route.params.token
    };

    return this.rest.saveItem('', {email_validation : sendData}, 'forgotemailvalidate').subscribe(res => {
      if (res === 'success') {
        return res;
      } else {
        this.alert.error(res, true);
        this.router.navigate(['auth/forget']);
      }
    }, err => {
      this.alert.error('Something went wrong!', true);
      this.router.navigate(['auth/forget']);
    })
  }
}

@Component({
  templateUrl: 'reset.component.html'
})
export class ResetComponent implements OnInit {
  resetForm: any;
  loading = false;
  returnUrl: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private formBuilder: FormBuilder,
              private alert: AlertService,
              private rest: RestService) { 
  }

  ngOnInit() {
    let customerId = this.route.snapshot.params.customerId;
    let token = this.route.snapshot.params.token;
    this.resetForm = this.formBuilder.group({
      'id': customerId,
      'token': token,
      'password': ['', [Validators.required]],
      'confirmation': ['', [Validators.required]]
    }, {validator: this.checkPasswords});
  }
  
  checkPasswords(resetForm) {
    let pass = resetForm.controls.password.value;
    let confirmPass = resetForm.controls.confirmation.value;
  
    return pass === confirmPass ? null : { notSame: true }
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }

  resetPassword() {
    this.alert.clear();
    if (this.resetForm.valid) {
      this.rest.showLoader();
      this.rest.saveItem('', {email_change_data : this.resetForm.value}, 'forgotemailchange').subscribe(
        data => {
          if(data != "success") {
            this.alert.error(data);
            this.rest.hideLoader();
          } else {
            this.rest.hideLoader();
            this.alert.success("Please login with new password", true);
            this.goToLogin();
          }
        },
        error => {
          this.alert.error("Something went wrong!");
          this.rest.hideLoader();
        });
    } else {
      this.alert.error('Please check the passwords are entered correctly');
    }
  }

}
