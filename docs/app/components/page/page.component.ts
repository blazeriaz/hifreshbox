/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component } from '@angular/core';

import { NgaMenuService } from '../../../../src/framework/theme';

@Component({
  selector: 'ngd-page',
  styles: [
    `
      :host /deep/ nga-card-body > * {
        display: block;
        padding: 1rem;
      }
    `
  ],
  template: `
    <nga-card>
      <nga-card-header>{{ currentItem?.name }}</nga-card-header>
      <nga-card-body>
        <ng-container *ngFor="let item of currentItem?.children">
          <ng-container [ngSwitch]="item.block">
            <ngd-description-block *ngSwitchCase="'class-description'" [block]="item" [klass]="item.klass"></ngd-description-block>
            <ngd-inputs-block *ngSwitchCase="'class-inputs'" [block]="item" [klass]="item.klass"></ngd-inputs-block>
            <ngd-outputs-block *ngSwitchCase="'class-outputs'" [block]="item" [klass]="item.klass"></ngd-outputs-block>
            <ngd-methods-block *ngSwitchCase="'class-methods'" [block]="item" [klass]="item.klass"></ngd-methods-block>
            <ngd-theme-block *ngSwitchCase="'class-theme'" [block]="item" [klass]="item.klass"></ngd-theme-block>
            <ngd-examples-block *ngSwitchCase="'class-examples'" [block]="item" [klass]="item.klass"></ngd-examples-block>
          </ng-container>
      </ng-container>
      </nga-card-body>
    </nga-card>
  `,
})
export class NgdPageComponent {

  currentItem: any;

  constructor(private menuService: NgaMenuService) {
    this.menuService.getSelectedItem().subscribe((event: {tag: string, item: any}) => {
      // TODO: check the tag
      if (event && event.item && event.item.data) {
        this.currentItem = event.item.data;
      }
    });
  }
}
