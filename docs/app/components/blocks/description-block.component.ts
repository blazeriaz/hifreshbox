/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngd-description-block',
  template: `
    <h5>{{ klass?.name }} <ng-container *ngIf="klass?.decorator?.selector">({{ klass?.decorator?.selector }})</ng-container></h5>
    <div>
      <strong>{{ klass?.comment?.shortText }}</strong>
      <p>{{ klass?.comment?.text }}</p>
    </div>
  `,
})
export class NgdDescriptionBlockComponent {

  @Input() block: any;
  @Input() klass: any;
}
