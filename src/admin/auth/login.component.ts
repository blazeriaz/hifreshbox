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
  
  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private formBuilder: FormBuilder,
              private alert: AlertService,
              private rest: RestService) { 
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.router.navigate(['dashboard']);
    } else {
      // reset login status
      this.auth.logout();
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  goToForgetPass() {
    this.router.navigate(['auth/forget']);
  }

  login() {
    this.alert.clear();
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.rest.showLoader();
      this.auth.login(this.loginForm.value.username, this.loginForm.value
        .password)
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
              if(error.status == 401) {
                this.alert.error("Please check the login details");
              } else {
                this.alert.error("Server Error");
              }
              this.rest.hideLoader();
            });
    } else {
      this.alert.error('Please enter username and password');
    }
  }

}
