import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from '../global';
import { AuthService } from 'services';


@Injectable()
export class RestService {
  private module: string;
  private criteria: string;
  private url: string;
  private loaderSubject = new Subject();
  private baseUrl;
  baseAPICard;
  loaderState = this.loaderSubject.asObservable();

  constructor(
    protected http: Http,
    protected router: Router,
    protected auth: AuthService
  ) {
    this.criteria = 'searchCriteria';
    this.baseUrl = GlobalVariable.BASE_API_URL;
    this.baseAPICard = GlobalVariable.API_URL;
  }

  changeBaseUrl(url) {
    this.baseUrl = url;
  }

  showLoader() {
      this.loaderSubject.next({show: true});
  }

  hideLoader() {
      this.loaderSubject.next({show: false});
  }

  setRestModule(module) {
    this.module = module;
    return this;
  }
  setRestCriteria(criteria) {
    this.criteria = criteria;
    return this;
  }

  addCrditCard(data) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });
    const url = this.baseAPICard + 'add_card.php';
    return this.http.post(url, data, options)
      .map((response: Response) => {
        return response.text();
      })
      .catch(this.onCatch)
      .do((res: Response) => {
         this.onSuccess(res);
      }, (error: any) => {
         this.onError(error);
      })
      .finally(() => {
         this.onEnd();
      });
  }

  getItems(page?, filterGroups?, pageSize?, url?, criteria?, sortOrders?) {
    if (!criteria) {
      criteria = this.criteria;
    }

    const searchParams = [];
    let pIndex = 0;
    searchParams[pIndex++] = criteria + '[pageSize]=' + (pageSize ? pageSize : 10);
    searchParams[pIndex++] = criteria + '[currentPage]=' + (page ? page : 1);

    sortOrders = sortOrders ? sortOrders : [];
    sortOrders.map((data, index) => {
      const key = criteria + '[sortOrders][' + index + ']';
      searchParams[pIndex++] = key + '[field]=' + data.field;
      searchParams[pIndex++] = key + '[direction]=' + data.direction;
    });

    filterGroups = filterGroups ? filterGroups : [];
    filterGroups.map((data, index) => {
      let key = criteria + '[filter_groups][' + index + ']';
      data.filters.map((filter, i) => {
        let key1 = key + '[filters][' + i + ']';
        searchParams[pIndex++] = key1 + '[field]=' + filter.field;
        searchParams[pIndex++] = key1 + '[value]=' + filter.value;
        searchParams[pIndex++] = key1 + '[condition_type]=' + filter.condition_type;
      })
    });

    const params = new URLSearchParams(searchParams.join('&'));

    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    const options = new RequestOptions({ headers: headers });

    if(!url) {
      if(this.module == "products") {
        url = this.module + '?' + params;
      } else {
        url = this.module + '/search?' + params;
      }      
    } else {
      url += "?" + params;
    }

    url = this.baseUrl + url;
    
    
    return this.http.get(url, options)
      .map((response: Response) => response.json())
      .catch(this.onCatch)
      .do((res: Response) => {
         this.onSuccess(res);
      }, (error: any) => {
         this.onError(error);
      })
      .finally(() => {
         this.onEnd();
      });
  }

 getItem(itemId, url?) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });

    if(!url) {
      url = this.module + '/' + itemId;
    }

    url = this.baseUrl + url;
 
    return this.http.get(url, options)
      .map((response: Response) => response.json())
      .catch(this.onCatch)
      .do((res: Response) => {
         this.onSuccess(res);
      }, (error: any) => {
         this.onError(error);
      })
      .finally(() => {
         this.onEnd();
      });
  }
  
  saveItem(itemId, data, url?) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });

    if(!url) {
      url = this.module + '/' + itemId;
    }

    url = this.baseUrl + url;
    
    
    let request;
    if(itemId) {
      request = this.http.put(
          url, data, options
        );
    } else {
      request = this.http.post(
          url, data, options
        );
    }
    return request.map((response: Response) => response.json())
      .catch(this.onCatch)
      .do((res: Response) => {
         this.onSuccess(res);
      }, (error: any) => {
         this.onError(error);
      })
      .finally(() => {
         this.onEnd();
      });
  }
  
  deleteItem(itemId, url?) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', 'Bearer ' + this.auth.getToken());
    let options = new RequestOptions({ headers: headers });

    if(!url) {
      url = this.module + '/' + itemId;
    }

    url = this.baseUrl + url;
    
    
    return this.http.delete(url, options)
      .map((response: Response) => response.json())
      .catch(this.onCatch)
      .do((res: Response) => {
         this.onSuccess(res);
      }, (error: any) => {
         this.onError(error);
      })
      .finally(() => {
         this.onEnd();
      });
  }

  private onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }

  private onSuccess(res: Response): void {
    
  }

  private onError(res: Response): void {
    
  }

  private onEnd(): void {
    
  }

}
