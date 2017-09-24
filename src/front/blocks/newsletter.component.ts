import { Component, OnInit, OnDestroy } from '@angular/core';

import * as GlobalVariable from 'global';
import { RestService } from 'services';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'newsletter',
    templateUrl: 'newsletter.component.html'
})
export class NewsletterComponent implements OnInit {
    backgrounds;
    nlForm;
    subscribed;

    constructor(
        private rest: RestService,
        private _fb: FormBuilder
    ) { }

    ngOnInit(): void {
        this.backgrounds = {
            signup: {
                'background-image': 'url(' + GlobalVariable.htmlImages + 'newsletter-signup.png)',
                'background-size': 'cover',
                'background-position' : 'bottom',
                'background-color' : '#DFDFDF'
            }
        };

        this.nlForm = this._fb.group({
            email : ['', [Validators.required, Validators.email]]
        });
        this.subscribed = false;
    }

    submit(): void {
        this.rest.saveItem('', this.nlForm.value, 'newsletter/add').subscribe(() => {
            this.subscribed = true;
            setTimeout(() => {
                this.subscribed = false;
            }, 3000);
            this.nlForm.reset();
        });
    }
}
