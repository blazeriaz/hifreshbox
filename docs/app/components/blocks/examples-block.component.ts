/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngd-examples-block',
  template: `
    <h5>Examples</h5>
    <code [innerHtml]="klass?.example"></code>
  `,
})
export class NgdExamplesBlockComponent {

  @Input() block: any;
  @Input() klass: any;
}
