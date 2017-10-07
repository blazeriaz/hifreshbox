import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from "../global";
import { AuthService } from 'services';


@Injectable()
export class UsersService {

  constructor(private http: Http, 
              private router: Router,
            private auth : AuthService) {
    
  }

  getUsers(page?, filterGroups?, pageSize?) {
    let searchCriteria = {
      pageSize : pageSize?pageSize:10,
      currentPage : page?page:1,      
    };

    let searchParams = [];
    let pIndex = 0;
    searchParams[pIndex++] = "searchCriteria[pageSize]=" + searchCriteria.pageSize;
    searchParams[pIndex++] = "searchCriteria[currentPage]=" + searchCriteria.currentPage;

    filterGroups = filterGroups?filterGroups:[];
    filterGroups.map((data, index) => {
      let key = "searchCriteria[filter_groups]["+index+"]";
      data.filters.map((filter, i) => {
        key += "[filters]["+i+"]";
        searchParams[pIndex++] = key + "[field]=" + filter.field;
        searchParams[pIndex++] = key + "[value]=" + filter.value;
        searchParams[pIndex++] = key + "[condition_type]=" + filter.condition_type; 
      })
    });

    let params = new URLSearchParams(searchParams.join("&"));

    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'customers/search?' + params,
        options
      ).map((response: Response) => response.json());
  }

  getUser(userId) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'customers/' + userId,
        options
      ).map((response: Response) => response.json());
  }
  
  saveUser(userId, data) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });
    
    if(userId) {
      return this.http.put(
          GlobalVariable.BASE_API_URL + 'customers/' + userId,
          data, options
        ).map((response: Response) => response.json());
    } else {
      return this.http.post(
          GlobalVariable.BASE_API_URL + 'customers',
          data, options
        ).map((response: Response) => response.json());
    }
  }
  
  deleteUser(userId) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });
    
    return this.http.delete(
        GlobalVariable.BASE_API_URL + 'customers/' + userId, options
      ).map((response: Response) => response.json());
  }

  getCountries() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'directory/countries',
        options
      ).map((response: Response) => response.json());
  }

}
