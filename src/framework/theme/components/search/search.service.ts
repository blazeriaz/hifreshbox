/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/share';

import { NgaThemeService } from '../../services/theme.service';

@Injectable()
export class NgaSuperSearchService {
  private searchTerms$ = new Subject();
  private searchActivations$ = new Subject();
  private searchDeactivations$ = new Subject();

  constructor(private themeService: NgaThemeService) { }

  activate(tag?: string) {
    this.searchActivations$.next({tag: tag});
  }

  onDeactivateSearch(searchType) {
    this.themeService.removeLayoutClass('with-search');
    setTimeout(() => this.themeService.removeLayoutClass(searchType), 500);
    this.searchDeactivations$.next(searchType);
  }

  onSearchSubmit(term) {
    this.searchTerms$.next(term);
  }

  onActivate(): Observable<any> {
    return this.searchActivations$.share();
  }

  searchDeactivations(): Observable<any> {
    return this.searchDeactivations$.share();
  }

  searchTerms(): Observable<any> {
    return this.searchTerms$.share();
  }
}
