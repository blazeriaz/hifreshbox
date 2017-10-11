import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from "global";
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'account.component.html'
})
export class AccountComponent implements OnInit {

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2
    ) { }
  
    ngOnInit(): void {
        this.renderer.addClass(document.body, 'white-header');
    }

    goToAccountMenu(menu) {
        this.router.navigate(['/', 'account', menu]);
    }

    ngOnDestroy() {
        this.renderer.removeClass(document.body, 'white-header');
    }
}
