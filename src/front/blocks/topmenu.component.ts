import { Component, OnInit, OnDestroy } from '@angular/core';

import * as GlobalVariable from 'global';
import { AuthService } from 'services';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'topmenu',
    templateUrl: 'topmenu.component.html'
})
export class TopmenuComponent implements OnInit {
    constructor(
        private auth: AuthService
    ) { }

    ngOnInit(): void {
    }

    islogin() {
        return this.auth.isLogin();
    }
}
