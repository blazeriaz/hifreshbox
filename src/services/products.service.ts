import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from "../global";


@Injectable()
export class ProductsService {

  constructor(private http: Http, 
              private router: Router) {
    
  }

  getIngredienOptions() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'listselection', options
    ).map((response: Response) => response.json());
  }

  getProducts(page?, filterGroups?, pageSize?) {

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
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers, search : params });

    return this.http.get(
        GlobalVariable.BASE_API_URL + 'products',
        options
      ).map((response: Response) => response.json());
  }

  getProduct(Productsku) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'products/' + Productsku,
        options
      ).map((response: Response) => response.json());    
  }
  
  saveProduct(Productsku, data) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    if(Productsku) {
      return this.http.put(
          GlobalVariable.BASE_API_URL + 'products/' + Productsku,
          data, options
        ).map((response: Response) => response.json());
    } else {
      return this.http.post(
          GlobalVariable.BASE_API_URL + 'products',
          data, options
        ).map((response: Response) => response.json());
    }
  }

  deleteProduct(Productsku) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(
        GlobalVariable.BASE_API_URL + 'products/' + Productsku, options
      ).map((response: Response) => response.json());
  }

}
