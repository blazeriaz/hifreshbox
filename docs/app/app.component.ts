/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component } from '@angular/core';

import 'style-loader!./app.theme.default.scss';

import { NgaMenuService } from '../../src/framework/theme/components/menu/menu.service';
import { NgaMenuItem } from '../../src/framework/theme/components/menu/menu.options';
import { List } from 'immutable';

import { STRUCTURE } from '../structure';

@Component({
  selector: 'ngd-app-root',
  template: `
    <nga-layout>
      <nga-layout-header></nga-layout-header>
      <nga-sidebar left>
        <nga-menu></nga-menu>
      </nga-sidebar>
      <nga-layout-column>
        <router-outlet></router-outlet>
      </nga-layout-column>
    </nga-layout>
  `,
})
export class NgdAppComponent {

  // TODO: get this from service
  structure = STRUCTURE;
  menuItems: List<NgaMenuItem> = List([]);

  constructor(private menuService: NgaMenuService) {
  }

  ngAfterViewInit() {
    this.menuItems = this.prepareMenuData(this.structure);
    this.menuService.addItems(this.menuItems);
  }

  // TODO: move to the service
  prepareMenuData(docs, parent: any = null): any {
    return List<NgaMenuItem>(docs.map((item: any) => {
      const menuItem: any = {};

      menuItem['title'] = item.name;
      menuItem['link'] = `${parent ? parent.link : ''}/${item.name.replace(/\s/, '-').toLowerCase()}`;
      if (item.children) {
        menuItem['children'] = this.prepareMenuData(item.children, menuItem);
      }
      return menuItem;
    }));
  }

}
