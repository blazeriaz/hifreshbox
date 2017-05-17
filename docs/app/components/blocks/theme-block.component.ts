/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngd-theme-block',
  template: `
    <h6>Theme Variables</h6>
    <code [innerHtml]="klass?.theme"></code>
  `,
})
export class NgdThemeBlockComponent {

  @Input() block: any;
  @Input() klass: any;
}
