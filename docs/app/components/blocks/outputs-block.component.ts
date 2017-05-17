/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngd-outputs-block',
  template: `
    <h5>Outputs</h5>
    <table class="table" *ngIf="klass?.outputs?.length > 0">
      TODO
    </table>
  `,
})
export class NgdOutputsBlockComponent {

  @Input() block: any;
  @Input() klass: any;
}
