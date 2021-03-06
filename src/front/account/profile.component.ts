import { Component, OnInit, OnDestroy, Injectable, ViewChild, TemplateRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { AlertService, RestService, AuthService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {
    @ViewChild('changePasswordModal') changePasswordModal: TemplateRef<any>;

    user: any;
    userForm: any;
    sentData: boolean;
    submitted: boolean;
    customAttributes = [];

    changePasswordForm: any;
    cpsubmitted: boolean;

    modalRef: BsModalRef;
    loadedFormData;
    countLoadedFormReqs;
    loadFormRequests;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private renderer: Renderer2,
        private auth: AuthService
    ) {

    }

    ngOnInit(): void {
        this.loadFormRequests = [];
        this.countLoadedFormReqs = 0;
        this.loadedFormData = false;
        this.loadFormData();
    }

    loadFormData() {
        this.auth.getUserInfo().subscribe(user => {
            if (!user) {
                this.auth.initLoggedInUserInfo();
            } else if (!user.loading) {
                this.user = user;
                this.initEditForm();
                this.loadedFormData = true;
            }
        });
        setTimeout(() => {
            if (!this.user || !this.user.id) {
                this.auth.initLoggedInUserInfo();
                this.loadFormData();
            }
        }, 2000);
    }

    initEditForm() {
        const customAttributesArray = [];
        ['customer_number'].map(attribute_code => {
            let value: any = '';
            if (this.user && this.user.custom_attributes) {
                const attribute = this.user.custom_attributes.find(x => x.attribute_code === attribute_code);
                value = attribute ? attribute.value : '';
            };
            this.customAttributes.push(attribute_code);
            customAttributesArray.push(this.addCustomArrtibute(attribute_code, value, false));
        });
        this.userForm = this._fb.group({
            'id': this.user.id,
            'store_id': 1,
            'website_id': 1,
            'firstname': [this.user.firstname, Validators.required],
            'lastname': [this.user.lastname, [Validators.required]],
            'email': [this.user.email, [Validators.required, Validators.email]],
            'gender': this.user.gender,
            'custom_attributes': this._fb.array(customAttributesArray)
        });
    }

    getCustomAttributeIndex(attribute_code) {
        return this.customAttributes.indexOf(attribute_code);
    }

    addCustomArrtibute(attribute_code, value, required) {
        if(attribute_code == 'customer_number') {
            value = [value, [Validators.required, Validators.minLength(10)]];
        } else if (required) {
            value = [value, Validators.required];
        }
        return this._fb.group({
            attribute_code : attribute_code,
            value : value
        });
    }

    setGender(gender) {
        this.userForm.patchValue({gender : gender});
    }

    getGender() {
        return this.userForm.value.gender;
    }

    setGenderClass(type) {
        if (this.getGender() === type) {
            return 'btn-primary';
        } else {
            return 'btn-secondary';
        }
    }

    setInputErrorClass(input) {
        const field = this.userForm.get(input) ? this.userForm.get(input) : this.changePasswordForm.get(input);
        const invalid = field.invalid && this.submitted;
        if (invalid) {
            return 'form-control-danger';
        }
    }

    setContainerErrorClass(input) {
        const field = this.userForm.get(input) ? this.userForm.get(input) : this.changePasswordForm.get(input);
        const invalid = field.invalid && this.submitted;
        if (invalid) {
            return 'has-danger';
        }
    }

    saveUser() {
        this.alert.clear();
        this.sentData = true;
        this.submitted = true;
        if (this.userForm.valid) {
            this.rest.saveItem('me', {customer: this.userForm.value}, 'customers/me').subscribe(data => {
                this.sentData = false;
                this.submitted = false;
                this.auth.initLoggedInUserInfo();
                this.alert.success('Account details are updated!');
            });
        } else {
            this.sentData = false;
            this.alert.error('Please check the form to enter all required details');
        }
    }

    initChangePasswordForm() {
        const regExPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$';
        this.changePasswordForm = this._fb.group({
            'currentPassword': ['', [Validators.required, Validators.pattern(regExPassword)]],
            'newPassword' : ['', [Validators.required, Validators.pattern(regExPassword)]],
            'confirmation': ['', [Validators.required]]
        }, {validator: this.checkPasswords});
    }

    checkPasswords(form) {
        const pass = form.controls.newPassword.value;
        const confirmPass = form.controls.confirmation.value;

        return pass === confirmPass ? null : { notSame: true }
    }

    openChangePasswordModal() {
        this.initChangePasswordForm();
        this.sentData = false;
        this.submitted = false;
        this.modalRef = this.modalService.show(this.changePasswordModal, {
            animated: true,
            keyboard: false,
            backdrop: true,
            ignoreBackdropClick: this.cpsubmitted
        });
    }

    doChangePassword() {
        this.alert.clear();
        this.sentData = true;
        this.submitted = true;
        if (this.changePasswordForm.valid) {
            this.rest.saveItem('me', this.changePasswordForm.value, 'customers/me/password').subscribe(data => {
                this.modalRef.hide();
                this.sentData = false;
                this.submitted = false;
                this.alert.success('Password changed successfully!');
            }, err => {
                this.sentData = false;
                var e = err.json();
                if(e.parameters) {
                    for(let i=0; i < e.parameters.length; i++) {
                        e.message = e.message.replace("%" + (i + 1), e.parameters[i])
                    }
                }
                this.alert.error(e.message ? e.message : 'Server error!', false, 'popup');
            });
        } else {
            this.sentData = false;
        }
    }

    ngOnDestroy() {
    }
}
