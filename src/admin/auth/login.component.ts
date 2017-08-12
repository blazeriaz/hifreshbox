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

  login() {console.log(this.loginForm);
    if (this.loginForm.dirty && this.loginForm.valid) {
      this.auth.login(this.loginForm.value.username, this.loginForm.value
        .password)
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alert.error(error.message);
                this.loading = false;
            });
    }
  }

}
