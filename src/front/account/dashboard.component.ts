import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'services';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
    user;

    constructor(
        private auth: AuthService,
        private router: Router
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
