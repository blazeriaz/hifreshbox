import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as GlobalVariable from "../global";


@Injectable()
export class RestService {
  private module: string;
  private criteria: string;
  private url: string;
  private loaderSubject = new Subject();
  loaderState = this.loaderSubject.asObservable();

  showLoader() {
      this.loaderSubject.next({show: true});
  }

  hideLoader() {
      this.loaderSubject.next({show: false});
  }

  constructor(private http: Http, 
              private router: Router) {
    this.criteria = "searchCriteria";
  }

  setRestModule(module) {
    this.module = module;
    return this;
  }
  setRestCriteria(criteria) {
    this.criteria = criteria;
    return this;
  }

  getItems(page?, filterGroups?, pageSize?, url?, criteria?) {
    let searchCriteria = {
      pageSize : pageSize?pageSize:10,
      currentPage : page?page:1,      
    };

    if(!criteria) {
      criteria = this.criteria;
    }
 
    let searchParams = [];
    let pIndex = 0;
    searchParams[pIndex++] = criteria + "[pageSize]=" + searchCriteria.pageSize;
    searchParams[pIndex++] = criteria + "[currentPage]=" + searchCriteria.currentPage;

    filterGroups = filterGroups?filterGroups:[];
    filterGroups.map((data, index) => {
      let key = criteria + "[filter_groups]["+index+"]";
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

    if(!url) {
      if(this.module == "products") {
        url = this.module + '?' + params;
      } else {
        url = this.module + '/search?' + params;
      }      
    }

    url = GlobalVariable.BASE_API_URL + url;
    
    
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
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });

    if(!url) {
      url = this.module + '/' + itemId;
    }

    url = GlobalVariable.BASE_API_URL + url;
    
    
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
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });

    if(!url) {
      url = this.module + '/' + itemId;
    }

    url = GlobalVariable.BASE_API_URL + url;
    
    
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
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let options = new RequestOptions({ headers: headers });

    if(!url) {
      url = this.module + '/' + itemId;
    }

    url = GlobalVariable.BASE_API_URL + url;
    
    
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
    console.log('Request successful');
  }

  private onError(res: Response): void {console.log(res);
    console.log('Error, status code: ' + res.status);
  }

  private onEnd(): void {
    
  }

}
