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
  submitted = false;
  passwordType = 'password';
  confirmPasswordType = 'password';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService,
              private formBuilder: FormBuilder,
              private alert: AlertService,
              private rest: RestService) {
    const regExPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$';
    this.registerForm = this.formBuilder.group({
      'email': ['', [Validators.required, Validators.email]],
      'firstname': ['', [Validators.required]],
      'lastname': ['', [Validators.required]],
      'password' : ['', [Validators.required, Validators.pattern(regExPassword)]],
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
      this.router.navigate(['/', 'account']);
    } else {
      // reset register status
      this.auth.logout();
    }
  }

  goToLogin() {
    this.router.navigate(['auth/login']);
  }

  isFieldInvalid(input) {
    const field = this.registerForm.get(input);
    if (this.submitted && this.registerForm.value.confirmation 
        && input === 'confirmation' 
        && this.registerForm.errors && this.registerForm.errors.notSame) {
      return true;
    }
    return this.submitted && field.invalid;
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

  changePasswordType() {
    if(this.passwordType == 'password') {
      this.passwordType = 'text';
    }else if(this.passwordType == 'text') {
      this.passwordType = 'password';
    }
  }

  changeConfirmPasswordType() {
    if(this.confirmPasswordType == 'password') {
      this.confirmPasswordType = 'text';
    }else if(this.confirmPasswordType == 'text') {
      this.confirmPasswordType = 'password';
    }
  }

  register() {
    this.alert.clear();
    this.submitted = true;
    window.scrollTo(0, 0);
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
                this.router.navigate(['/', 'auth', 'confirm-register']);
            },
            error => {
              const err = error.json();
              this.alert.error(err.message);
              this.rest.hideLoader();
            });
    } else {console.log(this.registerForm);
      this.alert.error('Please enter the all details correctly');
    }
  }

}
