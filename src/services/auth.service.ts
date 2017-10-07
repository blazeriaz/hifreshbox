import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from '../global';


@Injectable()
export class AuthService {
  module;

  constructor(private http: Http, 
              private router: Router) {    
  }

  setAuthModule(module) {
    this.module = module;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.isLogin()) {
        // logged in so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  isLogin() {
    return localStorage.getItem(this.module + '_token') ? true : false;
  }

  getToken() {
    return localStorage.getItem(this.module + '_token');
  }

  login(username: string, password: string) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(
        GlobalVariable.BASE_API_URL + 'integration/' + this.module + '/token', 
        JSON.stringify({ username: username, password: password }),
        options
      ).map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token = response.json();
        if (token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(this.module + '_token', token);
        }

        return token;
      });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem(this.module + '_token');
  }

}
