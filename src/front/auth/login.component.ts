import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from "services/auth.service";
import { AlertService, RestService } from "services";
import { AlertComponent } from "components";

@Component({
  template: ''
})
export class LogoutComponent implements OnInit {
  constructor(private router: Router,
    private auth: AuthService) { 
  }

  ngOnInit() {
    this.auth.setAuthModule('customer');
    this.auth.logout();
    this.router.navigate(['auth/login']);
  }
}

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
  loginForm: any;
  loading = false;
  returnUrl: string;
  passwordType = 'password';
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private formBuilder: FormBuilder,
              private alert: AlertService,
              private rest: RestService) { 
    this.loginForm = this.formBuilder.group({
      'username': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (this.auth.isLogin()) {
      this.router.navigate(['']);
    } else {
      // reset login status
      this.auth.logout();
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/account';
  }

  goToForgetPass() {
    this.router.navigate(['auth/forget']);
  }

  changePasswordType() {
    if(this.passwordType == 'password') {
      this.passwordType = 'text';
    }else if(this.passwordType == 'text') {
      this.passwordType = 'password';
    }
  }

  login() {
    this.alert.clear();
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.rest.showLoader();
      this.auth.login(this.loginForm.value.username, this.loginForm.value.password)
        .subscribe(
            data => {
              this.router.navigate([this.returnUrl]);
            },
            error => {
              if (error.status === 401) {
                this.alert.error('Please check the login details');
              } else {
                var e = error.json();
                this.alert.error(e.message);
              }
              this.rest.hideLoader();
            });
    } else {
      this.alert.error('Please enter username and password');
    }
  }
}
