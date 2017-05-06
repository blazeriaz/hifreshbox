/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component } from '@angular/core';

import 'style-loader!./app.theme.default.scss';

@Component({
  selector: 'ngd-app-root',
  template: `
    <nga-layout>
      <nga-layout-header></nga-layout-header>
      <nga-sidebar left>
        <nga-menu></nga-menu>
      </nga-sidebar>
      <nga-layout-column>
        <h1>Layout</h1>
      </nga-layout-column>
    </nga-layout>
  `,
})
export class NgdAppComponent {
}
