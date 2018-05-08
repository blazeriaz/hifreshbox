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
      const e = err.json();
      this.alert.error(e.message, true);
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
  submitted = false;
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
    const regExPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$';
    this.resetForm = this.formBuilder.group({
      'id': customerId,
      'reset_token': token,
      'new_password': ['', [Validators.required, Validators.pattern(regExPassword)]],
      'confirmation': ['', [Validators.required]]
    }, {validator: this.checkPasswords});
  }

  checkPasswords(resetForm) {
    const pass = resetForm.controls.new_password.value;
    const confirmPass = resetForm.controls.confirmation.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }

  isFieldInvalid(input) {
    const field = this.resetForm.get(input);
    if (this.resetForm.value.confirmation 
        && input === 'confirmation' 
        && this.resetForm.errors && this.resetForm.errors.notSame) {
      return true;
    }
    return field.touched && field.invalid;
  }

  setInputErrorClass(input) {
    if (this.isFieldInvalid(input)) {
      return 'form-control-danger';
    }
  }

  setContainerErrorClass(input) {
    if (this.isFieldInvalid(input)) {
      return 'has-danger';
    }
  }

  resetPassword() {
    this.alert.clear();
    this.submitted = true;
    if (this.resetForm.valid) {
      this.rest.showLoader();
      this.rest.saveItem('', this.resetForm.value, 'customer/reset-password').subscribe(
        data => {
          if (data) {
            this.rest.hideLoader();
            this.alert.success('Please login with new password', true);
            this.goToLogin();
          } else {
            this.alert.error(data);
            this.rest.hideLoader();
          }
        },
        error => {
          const e = error.json();
          this.alert.error(e.message);
          this.rest.hideLoader();
        });
    } else {
      this.alert.error('Please check the passwords are entered correctly');
    }
  }
}
