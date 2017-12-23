import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from "../global";
import { AuthService } from 'services';


@Injectable()
export class ProductsService {

  constructor(private http: Http, 
              private router: Router,
            private auth: AuthService) {
    //this.rest.setRestModule('products');
  } 

  getIngredienOptions() {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });
    return this.http.get(
        GlobalVariable.BASE_API_URL + 'listselection', options
    ).map((response: Response) => response.json())
    .map(x => {
      x[0].ingredients = x[0].ingredients.filter(y => y.is_active == 1);
      x[0].portions = x[0].portions.filter(y => y.is_active == 1);
      return x;
    });
  }

  saveProductImage(Productsku, image) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });
    
    return this.http.post(
        GlobalVariable.BASE_API_URL + 'products/' + Productsku + '/media', {entry : image}, options
      ).map((response: Response) => response.json());
  }

}
