import { Component, OnInit } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from 'global';

@Component({
    template: `
        <h1 class='text-center'>WooHoo!</h1>
        <h4 class='text-center'>We're excited that you're excited!</h4>
    `
})
export class SuccessComponent implements OnInit {
    constructor(
        private alert: AlertService,
        private rest: RestService
    ) { }

    ngOnInit(): void {
    }
}
