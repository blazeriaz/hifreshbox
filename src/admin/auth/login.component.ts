import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from "services/auth.service";
import { AlertService } from "services";
import { AlertComponent } from "components";

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
              private alert: AlertService) { 
    this.loginForm = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // reset login status
    this.auth.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  login() {
    this.alert.clear();
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.loading = true;
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
              this.loading = false;
            });
    } else {
      this.alert.error('Please enter username and password');
    }
  }

}