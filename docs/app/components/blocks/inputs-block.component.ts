/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngd-inputs-block',
  template: `
    <h5>Inputs</h5>
    <table class="table table-striped" *ngIf="klass?.inputs?.length > 0">
      <thead>
        <tr>
          <td>Name</td>
          <td>Type</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let input of klass?.inputs">
          <td>{{ input.name }}</td>
          <td>{{ input.type?.name }}</td>
          <td>{{ input.comment?.shortText }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class NgdInputsBlockComponent {

  @Input() block: any;
  @Input() klass: any;
}
