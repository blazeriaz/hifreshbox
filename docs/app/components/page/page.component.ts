/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component } from '@angular/core';

import { NgaMenuService } from '../../../../src/framework/theme';
import { STRUCTURE } from '../../../structure';

@Component({
  selector: 'ngd-page',
  template: `
    <h1>{{ currentItem.name }}</h1>
    <ng-container *ngFor="let block of currentItem.blocks">
         
      <ng-container [ngSwitch]="block.type">
        <ngd-block-generated *ngSwitchCase="'generated'" [item]="block"></ngd-block-generated>
      </ng-container>
        
    </ng-container>
  `,
})
export class NgdPageComponent {

  docs: any[] = STRUCTURE;
  currentItem: any;

  constructor(private menuService: NgaMenuService) {
  }

  ngOnInit() {
    // TODO: get current item from menu!!!
    this.currentItem = this.docs[1].children[1];
    console.log(this.currentItem);
  }

}
