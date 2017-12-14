import { Component, OnInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { AlertService, RestService } from "services";
import { AlertComponent } from "components";

@Injectable()
export class checkActivateTokenResolve implements Resolve<any> {

  constructor(private rest: RestService, private alert: AlertService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot) {
    const sendData = {confirmationKey: route.params.token, customerId: route.params.id};
    const url = 'customers/activateuser';
    return this.rest.saveItem(true, sendData, url).subscribe(res => {
      if (res) {        
        this.alert.success('Please login to proceed further', true);
        this.router.navigate(['/', 'auth', 'login']);
        return res;
      } else {
        this.alert.error(res, true);
        this.router.navigate(['/', 'auth', 'login']);
      }
    }, err => {
      const e = err.json();
      this.alert.error(e.message, true);
      this.router.navigate(['/', 'auth', 'login']);
    })
  }
}

@Component({
  template: ''
})
export class ActivateComponent implements OnInit {
  resetForm: any;
  loading = false;
  returnUrl: string;

  constructor(private router: Router,
              private alert: AlertService,
              private rest: RestService) {
  }

  ngOnInit() {
  }
}
