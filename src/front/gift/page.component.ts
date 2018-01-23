import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { RestService, AlertService, AuthService } from 'services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import * as GlobalVariable from 'global';
import { Router } from '@angular/router';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  templateUrl: 'page.component.html'
})
export class PageComponent implements OnInit {
    @ViewChild('redeemcode') redeemcode: TemplateRef<any>;
    backgrounds;
    modalRef: BsModalRef;
    modalViewRef: BsModalRef;
    redeemForm;
    modelDisabled;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private auth: AuthService,
        private router: Router,
        private modalService: BsModalService,
        private _fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.backgrounds = {
            header: {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'top-banner-week-menu.png)',
                'background-position' : 'bottom',
                'background-size': 'cover', 
                'background-attachment' : 'fixed',
                'background-color' : '#2F2F30'
            },
            recipe : GlobalVariable.htmlImages + 'each-recipe-img.png',
            cap : GlobalVariable.htmlImages + 'chef-cap-green.png',
            culinery : GlobalVariable.htmlImages + 'culinery.png',
            whatfreshbox : GlobalVariable.htmlImages + 'what-is-freshbox.png',
            gray : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'hiw-bg.png)',
                'background-position' : 'bottom',
                'background-color' : '#DFDFDF',
                'background-size': 'cover',
            },
            testimonials : {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'testimonials.png)',
                'background-size': 'cover',
                'background-position' : 'bottom'
            },
            orders : {
                'background-image': 'url('+GlobalVariable.htmlImages+'orders-bg.png)',
                'background-size': '95% auto', 
                'background-position' : 'top left',
                'background-repeat' : 'no-repeat',
            },
            signup: {
                'background-image': 'url('+GlobalVariable.htmlImages+'newsletter-signup.png)',
                'background-size': 'cover', 
                'background-position' : 'bottom'
            }
        };

        this.redeemForm = this._fb.group({
            'redeemed_code': ['', Validators.required]
        });
    }

    openRedeemForm() {
        if(!this.auth.isLogin()) {            
            this.router.navigate(['/', 'auth', 'login'], {queryParams : {returnUrl : '/gift'}});
            this.alert.error('Please login first for redeeming the gift', true);
            return;
        }
        this.redeemForm.reset();
        this.modalRef = this.modalService.show(this.redeemcode, {
            animated: true,
            keyboard: false,
            backdrop: true
        });
    }

    setInputErrorClass(form, input) {
        const field = form.get(input);
        const invalid = field.invalid && field.touched;
        if (invalid) {
            return 'form-control-danger';
        }
    }

    setContainerErrorClass(form, input) {
        const field = form.get(input);
        const invalid = field.invalid && field.touched;
        if (invalid) {
            return 'has-danger';
        }
    }

    redeemGift() {
        if (this.redeemForm.invalid) {
            return;
        }
        this.modelDisabled = true;
        this.alert.clear();
        this.rest.saveItem(false, {redeem_data: this.redeemForm.value}, 'wallet/redeem').subscribe(res => { 
            this.modelDisabled = false;           
            if(res[0] === 'error') {
                this.alert.error(res[1], false, 'popup');
            } else {
                this.modalRef.hide();
                this.router.navigate(['/', 'success', 'gift']);
            }
        }, e => {
            this.modelDisabled = false;
            var err = e.json();
            this.alert.error(err.message, false, 'popup');
        });
    }
}
