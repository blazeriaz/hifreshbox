import { Component, OnInit } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from 'global';
import { ActivatedRoute } from '@angular/router';

@Component({
    template: `
        <h1 class='text-center'>WooHoo!</h1>
        <h4 class='text-center'>{{message}}</h4>
    `
})
export class SuccessComponent implements OnInit {
    message;
    constructor(
        private alert: AlertService,
        private rest: RestService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const type = this.route.snapshot.params.type;
        switch(type) {
            case 'newsletter':
                this.message = "Thanks for subscription to get exciting offers!";
                break;
            default:
                this.message = "We're excited that you're excited!";
        }
    }
}
