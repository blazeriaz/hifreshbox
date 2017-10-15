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
    const customerId = route.params.customerId;
    const token = route.params.token;
    return this.rest.getItem('', 'customers/' + customerId + '/password/resetLinkToken/' + token).subscribe(res => {
      if (res) {
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
    const customerId = this.route.snapshot.params.customerId;
    const token = this.route.snapshot.params.token;
    this.resetForm = this.formBuilder.group({
      'id': customerId,
      'token': token,
      'password': ['', [Validators.required]],
      'confirmation': ['', [Validators.required]]
    }, {validator: this.checkPasswords});
  }

  checkPasswords(resetForm) {
    const pass = resetForm.controls.password.value;
    const confirmPass = resetForm.controls.confirmation.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }

  resetPassword() {
    this.alert.clear();
    if (this.resetForm.valid) {
      this.rest.showLoader();
      this.rest.saveItem('', this.resetForm.value, 'customer/reset-password').subscribe(
        data => {
          if (data !== 'success') {
            this.alert.error(data);
            this.rest.hideLoader();
          } else {
            this.rest.hideLoader();
            this.alert.success('Please login with new password', true);
            this.goToLogin();
          }
        },
        error => {
          this.alert.error('Something went wrong!');
          this.rest.hideLoader();
        });
    } else {
      this.alert.error('Please check the passwords are entered correctly');
    }
  }
}
