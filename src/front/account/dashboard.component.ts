import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService } from 'services';

import * as GlobalVariable from 'global';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    user;

    constructor(
        private alert: AlertService,
        private rest: RestService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.rest.getItem('me', 'customers/me').subscribe(user => {
            this.user = user;
        })
    }

    goToAccountMenu(menu) {
        this.router.navigate(['/', 'account', menu]);
    }

    ngOnDestroy() {
    }
}
