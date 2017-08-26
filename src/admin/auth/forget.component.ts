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
      this.rest.getItem('', 'forgotemail/' + this.forgetForm.value.email).subscribe(
        data => {
            this.alert.error("Please check your mail to reset the password");
        },
        error => {
          this.alert.error("Server Error");
          this.rest.hideLoader();
        });
    } else {
      this.alert.error('Please enter username and password');
    }
  }

}
