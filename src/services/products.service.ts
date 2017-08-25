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
    //this.rest.setRestModule('products');
  } 

  getIngredienOptions() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'listselection', options
    ).map((response: Response) => response.json());
  }

  saveProductImage(Productsku, image) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });
    
    return this.http.post(
        GlobalVariable.BASE_API_URL + 'products/' + Productsku + '/media', {entry : image}, options
      ).map((response: Response) => response.json());
  }

}
