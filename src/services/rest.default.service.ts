import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from '../global';
import { AuthService, RestService } from 'services';


@Injectable()
export class RestDefaultService extends RestService {

  constructor(
    protected http: Http,
    protected router: Router,
    protected auth: AuthService
  ) {
    super(http, router, auth);
    super.changeBaseUrl(GlobalVariable.BASE_DEFAULT_API_URL);
  }
}
