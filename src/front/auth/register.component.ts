import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'services/auth.service';
import { AlertService, RestService } from 'services';
import { AlertComponent } from 'components';

@Component({
  templateUrl: 'register.component.html'
})
export class RegisterComponent implements OnInit {
  registerForm: any;
  loading = false;
  returnUrl: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private formBuilder: FormBuilder,
              private alert: AlertService,
              private rest: RestService) {
    this.registerForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'firstname': ['', [Validators.required]],
      'lastname': ['', [Validators.required]],
      'password' : ['', [Validators.required]],
      'confirmation': ['', [Validators.required]]
    }, {validator: this.checkPasswords});
  }
  
  checkPasswords(form) {
    const pass = form.controls.password.value;
    const confirmPass = form.controls.confirmation.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  ngOnInit() {
    if (this.auth.isLogin()) {
      this.router.navigate(['']);
    } else {
      // reset register status
      this.auth.logout();
    }
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }

  register() {
    this.alert.clear();
    if (this.registerForm.valid) {
      this.rest.showLoader();
      const sendData = {
        customer : {
          email : this.registerForm.value.email,
          firstname : this.registerForm.value.firstname,
          lastname : this.registerForm.value.lastname,
          storeId : 1,
          websiteId : 1
        },
        password : this.registerForm.value.password
      };
      this.rest.saveItem('', sendData, 'customers')
        .subscribe(
            data => {
                this.router.navigate(['/', 'auth', 'login']);
            },
            error => {
              if(error.status === 401) {
                this.alert.error('Please check the register details');
              } else {
                this.alert.error('Server Error');
              }
              this.rest.hideLoader();
            });
    } else {
      this.alert.error('Please enter the all details correctly');
    }
  }

}
