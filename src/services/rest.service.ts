import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from "../global";


@Injectable()
export class RestService {
  private module: string;
  private criteria: string;

  constructor(private http: Http, 
              private router: Router) {
    this.criteria = "criteria";
  }

  setRestModule(module) {
    this.module = module;
  }
  setRestCriteria(criteria) {
    this.criteria = criteria;
  }

  getItems(page?, filterGroups?, pageSize?) {
    let searchCriteria = {
      pageSize : pageSize?pageSize:10,
      currentPage : page?page:1,      
    };

    let searchParams = [];
    let pIndex = 0;
    searchParams[pIndex++] = this.criteria + "[pageSize]=" + searchCriteria.pageSize;
    searchParams[pIndex++] = this.criteria + "[currentPage]=" + searchCriteria.currentPage;

    filterGroups = filterGroups?filterGroups:[];
    filterGroups.map((data, index) => {
      let key = this.criteria + "[filter_groups]["+index+"]";
      data.filters.map((filter, i) => {
        key += "[filters]["+i+"]";
        searchParams[pIndex++] = key + "[field]=" + filter.field;
        searchParams[pIndex++] = key + "[value]=" + filter.value;
        searchParams[pIndex++] = key + "[condition_type]=" + filter.condition_type; 
      })
    });

    let params = new URLSearchParams(searchParams.join("&"));

    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + this.module + '/search?' + params,
        options
      ).map((response: Response) => response.json());
  }

  getItem(itemId) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + this.module + '/' + itemId,
        options
      ).map((response: Response) => response.json());
  }
  
  saveItem(itemId, data) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    if(itemId) {
      return this.http.put(
          GlobalVariable.BASE_API_URL + this.module + '/' + itemId,
          data, options
        ).map((response: Response) => response.json());
    } else {
      return this.http.post(
          GlobalVariable.BASE_API_URL + this.module,
          data, options
        ).map((response: Response) => response.json());
    }
  }
  
  deleteItem(itemId) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.delete(
        GlobalVariable.BASE_API_URL + this.module + '/' + itemId, options
      ).map((response: Response) => response.json());
  }

}
