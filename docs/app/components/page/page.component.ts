/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component } from '@angular/core';

import { NgaMenuService } from '../../../../src/framework/theme';

@Component({
  selector: 'ngd-page',
  template: `
    <nga-card>
      <!--<nga-card-header>{{ currentItem.name }}</nga-card-header>-->
      <nga-card-body>
        <!--<ng-container *ngFor="let block of currentItem.blocks">-->
           <!---->
        <!--<ng-container [ngSwitch]="block.type">-->
          <!--<ngd-block-generated *ngSwitchCase="'generated'" [item]="block"></ngd-block-generated>-->
        <!--</ng-container>-->
          <!---->
      <!--</ng-container>-->
      </nga-card-body>
    </nga-card>
  `,
})
export class NgdPageComponent {

  currentItem: any;

  constructor(private menuService: NgaMenuService) {
  }

  ngOnInit() {
    // TODO: get current item from menu!!!
    //this.currentItem = this.docs[1].children[1];
    //console.log(this.currentItem);
  }

}
