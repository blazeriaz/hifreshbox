import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from '../global';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AuthService {
  module;
  baseUrl;
  user:any = null;
  private userInfo = new BehaviorSubject(null);
  private loginSubject = new BehaviorSubject({
    action: null
  });

  constructor(
    private http: Http,
    private router: Router
  ) {
    this.baseUrl = GlobalVariable.BASE_API_URL;
  }

  initLoggedInUserInfo() {
    if(this.user && this.user.loading) {
      return;
    }
    if (this.isLogin()) {
      if(!this.user) {
        this.user = {};
      }
      this.user.loading = true;
      this.userInfo.next(this.user);
      this.getItem('customers/me').subscribe(user => {
        this.user = user;
        this.user.loading = false;
        this.userInfo.next(user);
      });
    } else {
      this.user = null;
    }
  }

  getUserInfo() { 
    return this.userInfo.asObservable();
  }

  getItem(url) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.getToken());
    const options = new RequestOptions({ headers: headers });
    return this.http.get(this.baseUrl + url, options)
      .map((response: Response) => response.json());
  }

  getLoginSubject() {
    return this.loginSubject.asObservable();
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

  isAdminLogin() {
    return localStorage.getItem('admin_token') ? true : false;
  }

  getToken() {
    return localStorage.getItem(this.module + '_token');
  }

  login(username: string, password: string) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });

    return this.http.post(
        GlobalVariable.BASE_API_URL + 'integration/' + this.module + '/token',
        JSON.stringify({ username: username, password: password }),
        options
      ).map((response: Response) => {
        // login successful if there's a jwt token in the response
        const token = response.json();
        if (token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem(this.module + '_token', token);
          this.loginSubject.next({
            action : 'login'
          });
          this.initLoggedInUserInfo();
        }

        return token;
      });
  }

  logout() {
    this.loginSubject.next({
      action : 'logout'
    });
    // remove user from local storage to log user out
    localStorage.removeItem(this.module + '_token');
  }

}
