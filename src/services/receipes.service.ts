import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from "../global";


@Injectable()
export class RecipesService {

  constructor(private http: Http, 
              private router: Router) {
    
  }

  getRecipes() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'products?searchCriteria[pageSize]=5&searchCriteria[currentPage]=2&searchCriteria[filter_groups][0][filters][0][field]=attribute_set_id&searchCriteria[filter_groups][0][filters][0][value]=15&searchCriteria[filter_groups][0][filters][0][condition_type]=eq',
        options
      ).map((response: Response) => response.json());
  }

}
