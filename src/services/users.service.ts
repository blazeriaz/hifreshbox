import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from "../global";


@Injectable()
export class UsersService {

  constructor(private http: Http, 
              private router: Router) {
    
  }

  getUsers() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'customers/search?searchCriteria[pageSize]=5&searchCriteria[currentPage]=1',
        options
      ).map((response: Response) => response.json());
  }

  getUser(userId) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'customers/' + userId,
        options
      ).map((response: Response) => response.json());
  }
  
  saveUser(userId, data) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.post(
        GlobalVariable.BASE_API_URL + 'customers/' + userId,
        data, options
      ).map((response: Response) => response.json());
  }

}
