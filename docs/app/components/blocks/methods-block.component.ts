/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngd-methods-block',
  template: `
    <h6>Methods</h6>
    <table class="table" *ngIf="klass?.methods?.length > 0">
      <thead>
        <tr>
          <td>Name</td>
          <td>Parameters</td>
          <td>Returns</td>
          <td>Description</td>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let method of klass?.methods">
          <td>{{ method.name }}</td>
          <td>
            <ng-container *ngFor="let param of method.parameters">{{param.name}}: {{param.type.name}}<br></ng-container>
          </td>
          <td>{{ method.comment?.returns }}</td>
          <td>{{ method.comment?.shortText }}</td>
        </tr>
      </tbody>
    </table>
  `,
})
export class NgdMethodsBlockComponent {

  @Input() block: any;
  @Input() klass: any;
}
