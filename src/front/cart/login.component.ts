import { Component, OnInit, OnDestroy, Renderer2, Output, EventEmitter } from '@angular/core';
import { RestService, AlertService, AuthService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
    selector: 'checkout-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit, OnDestroy {
    @Output() back = new EventEmitter();
    @Output() next = new EventEmitter();

    checkoutLoginForm;
    loading;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2,
        private _fb: FormBuilder,
    ) { }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.loading = false;
        const regExPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$';
        this.checkoutLoginForm = this._fb.group({
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

    isFieldInvalid(input) {
        const field = this.checkoutLoginForm.get(input);
        if (this.checkoutLoginForm.value.confirmation 
            && input === 'confirmation' 
            && this.checkoutLoginForm.errors && this.checkoutLoginForm.errors.notSame) {
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

    checkoutRegister() {
        this.alert.clear();
        window.scrollTo(0, 0);
        if (this.checkoutLoginForm.valid) {
          this.rest.showLoader();
          const sendData = {
            customer : {
              email : this.checkoutLoginForm.value.email,
              firstname : this.checkoutLoginForm.value.firstname,
              lastname : this.checkoutLoginForm.value.lastname,
              storeId : 1,
              websiteId : 1
            },
            password : this.checkoutLoginForm.value.password
          };
          this.loading = true;
          this.rest.saveItem('', sendData, 'customers')
            .subscribe(
                data => {
                    this.rest.showLoader();
                    this.auth.login(this.checkoutLoginForm.value.email, this.checkoutLoginForm.value.password).subscribe(res => {
                        this.next.emit('login');
                        this.rest.hideLoader();
                    },
                    error => {
                        if (error.status === 401) {
                            this.alert.error('Please check the login details');
                        } else {
                            this.alert.error('Server Error');
                        }
                        this.rest.hideLoader();
                    });
                },
                error => {
                  const err = error.json();
                  this.alert.error(err.message);
                  this.loading = false;
                  this.rest.hideLoader();
                });
        } else {
          this.alert.error('Please enter the all details correctly');
        }
        this.alert.clear();
        if (this.checkoutLoginForm.valid) {
            
        } else {
            this.alert.error('Please check the form to enter all required details');
        }
    }

    goBack() {
        this.back.emit('login');
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
