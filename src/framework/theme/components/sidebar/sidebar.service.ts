/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publish';

/**
 * Global app service for sidebar control.
 *
 * Allows to control sidebar(s) state and also listen to subscribe events.
 */
@Injectable()
export class NgaSidebarService {

  private toggle$ = new Subject();
  private expand$ = new Subject();
  private collapse$ = new Subject();

  /**
   * Toggle event observable
   * @returns Observable<{tag :string}>
   */
  onToggle(): Observable<{ compact: boolean, tag: string }> {
    return this.toggle$.publish().refCount();
  }

  /**
   * Expanded event observable
   * @returns Observable<{tag :string}>
   */
  onExpand(): Observable<{ tag: string }> {
    return this.expand$.publish().refCount();
  }

  /**
   * Collapsed event observable
   * @returns Observable<{tag :string}>
   */
  onCollapse(): Observable<{ tag: string }> {
    return this.collapse$.publish().refCount();
  }

  /**
   * Toggles sidebar state (expanded|collapsed|compacted)
   * @param compact boolean If true, then sidebar state will be changed between expanded & compacted,
   *        otherwise - between expanded & collapsed. False by default.
   * @param tag string
   * @returns void
   */
  toggle(compact: boolean = false, tag?: string) {
    this.toggle$.next({ compact, tag });
  }

  /**
   * Expandes the sidebar (sidebar entity is selected by the tag)
   * @param tag string
   * @returns void
   */
  expand(tag?: string) {
    this.expand$.next({ tag });
  }

  /**
   * Collapses the sidebar (sidebar entity is selected by the tag)
   * @param tag string
   * @returns void
   */
  collapse(tag?: string) {
    this.collapse$.next({ tag });
  }

}
