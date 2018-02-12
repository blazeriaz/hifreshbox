import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { RestService, AlertService, AuthService } from 'services';

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
        private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.auth.getUserInfo().subscribe(user => {
            if (user && !user.loading) {
                this.user = user;
            }
        });
        setTimeout(() =>{
            if(!this.user) {
                this.auth.initLoggedInUserInfo();
            }
        }, 5000);
    }

    goToAccountMenu(menu) {
        this.router.navigate(['/', 'account', menu]);
    }

    goToMenu(menu) {
        this.router.navigate(menu);
    }

    ngOnDestroy() {
    }
}
