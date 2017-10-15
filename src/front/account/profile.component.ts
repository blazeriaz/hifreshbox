import { Component, OnInit, Injectable, ViewChild, TemplateRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { UsersService, AlertService, RestService } from 'services';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
    @ViewChild('changePasswordModal') changePasswordModal: TemplateRef<any>;

    user: any;
    userForm: any;
    submitted: boolean;
    
    changePasswordForm: any;
    cpsubmitted: boolean;

    modalRef: BsModalRef;
    loadedFormData;
    countLoadedFormReqs;
    loadFormRequests;

    constructor(
        private usersService: UsersService,
        private alert: AlertService,
        private rest: RestService,
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService,
        private renderer: Renderer2
    ) {

    }

    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
        this.loadFormRequests = [];
        this.countLoadedFormReqs = 0;
        this.loadedFormData = false;
        this.loadFormData();
    }

    checkAllFormDataLoaded() {
      if (--this.countLoadedFormReqs === 0) {
        this.initEditForm();
        this.loadedFormData = true;
      }
    }

    loadFormData() {
        this.loadFormRequests.push(
            this.rest.getItem('me', 'customers/me').subscribe(user => {
                this.user = user;
                this.checkAllFormDataLoaded();
            })
        );
        this.countLoadedFormReqs++;
    }

    initEditForm() {
        this.userForm = this._fb.group({
            'id': this.user.id,
            'store_id': 1, 
            'website_id': 1,
            'firstname': [this.user.firstname, Validators.required],
            'lastname': [this.user.lastname, [Validators.required]],
            'email': [this.user.email, [Validators.required, Validators.email]],
            'gender': this.user.gender
        });
    }

    setGender(gender) {
        this.userForm.patchValue({gender : gender});
    }

    getGender() {
        return this.userForm.value.gender;
    }

    setGenderClass(type) {
        if(this.getGender() == type) {
            return 'btn-primary';
        } else {
            return 'btn-secondary';
        }
    }

    setInputErrorClass(input) {
        let field = this.userForm.get(input) ? this.userForm.get(input) : this.changePasswordForm.get(input);
        let invalid = field.invalid && this.submitted;
        if(invalid) return 'form-control-danger';
    }

    setContainerErrorClass(input) {
        let field = this.userForm.get(input) ? this.userForm.get(input) : this.changePasswordForm.get(input);
        let invalid = field.invalid && this.submitted;
        if(invalid) return 'has-danger';
    }

    saveUser() {
        this.alert.clear();
        this.submitted = true;
        if (this.userForm.valid) {
            this.rest.saveItem('me', {customer: this.userForm.value}, "customers/me").subscribe(data => {
                this.alert.success("Account details are updated!");
            });
        } else {
            this.alert.error("Please check the form to enter all required details");
        }
    }

    initChangePasswordForm() {
        this.changePasswordForm = this._fb.group({
            'currentPassword': ['', [Validators.required]],
            'newPassword' : ['', [Validators.required]],
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
        this.submitted = true;
        if (this.changePasswordForm.valid) {            
            this.rest.saveItem('me', this.changePasswordForm.value, "customers/me/password").subscribe(data => {
                this.modalRef.hide();
                this.submitted = false;
                this.alert.success("Password changed successfully!");
            }, err => {
                this.alert.error(err.message?err.message:"Server error!");
            });
        } else {
            this.alert.error("Please check and correct all details");
        }
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
