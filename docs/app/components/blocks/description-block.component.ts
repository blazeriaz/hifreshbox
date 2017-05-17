/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngd-description-block',
  template: `
    <h4>{{ klass?.name }} <ng-container *ngIf="klass?.decorator?.selector">({{ klass?.decorator?.selector }})</ng-container></h4>
    <p>
      <strong>{{ klass?.comment?.shortText }}</strong>
      <p>{{ klass?.comment?.text }}</p>
    </p>
  `,
})
export class NgdDescriptionBlockComponent {

  @Input() block: any;
  @Input() klass: any;
}
