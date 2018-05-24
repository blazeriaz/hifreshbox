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
        setTimeout(() => {
          this.alert.success('Please login to proceed further', true);
          this.router.navigate(['/', 'auth', 'login']);
        }, 3000);
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
  template: `
    <div class='overlay_loading text-success text-center py-5' style="position: static;">
      <p>Checking with your data. Please wait...</p>
      <div class='sk-three-bounce'>
        <div class='sk-child sk-bounce1'></div>
        <div class='sk-child sk-bounce2'></div>
        <div class='sk-child sk-bounce3'></div>
      </div>
    </div>
  `
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
