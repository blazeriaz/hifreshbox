/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Component, Input } from '@angular/core';
var DOCS: any = require('../../../docs.json');

@Component({
  selector: 'ngd-block-generated',
  template: `
    <nga-card>
      <nga-card-body>
        <ng-container [ngSwitch]="item.tag">
          <ng-container *ngSwitchCase="'description'">
            <nga-card-header>Description</nga-card-header>
            <nga-card-body>
              <strong>{{ doc?.comment?.shortText }}</strong>
              <p>{{ doc?.comment?.text }}</p>
            </nga-card-body>
          </ng-container>
          
          <ng-container *ngSwitchCase="'inputs'">
            <nga-card-header>Inputs</nga-card-header>
            <nga-card-body>
              <table class="table" *ngIf="doc?.inputs?.length > 0">
                <thead>
                  <tr>
                    <td>Name</td>
                    <td>Type</td>
                    <td>Description</td>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let input of doc?.inputs">
                    <td>{{ input.name }}</td>
                    <td>{{ input.type?.name }}</td>
                    <td>{{ input.comment?.shortText }}</td>
                  </tr>
                </tbody>
              </table>
            </nga-card-body>
          </ng-container>
          
          <ng-container *ngSwitchCase="'outputs'">
            <nga-card-header>Outputs</nga-card-header>
          </ng-container>
          
          <ng-container *ngSwitchCase="'examples'">
            <nga-card-header>Examples</nga-card-header>
            <nga-card-body>
              <code [innerHtml]="doc?.example"></code>
            </nga-card-body>
          </ng-container> 
                   
          <ng-container *ngSwitchCase="'theme'">
            <nga-card-header>Theme Variables</nga-card-header>
            <nga-card-body>
              <code [innerHtml]="doc?.theme"></code>
            </nga-card-body>
          </ng-container>
        </ng-container>
      </nga-card-body>
    </nga-card>
  `,
})
export class NgdBlockGeneratedComponent {

  @Input() item: any;

  doc: any;

  ngOnInit() {
    this.doc = this.findComponent(this.item.klass, DOCS.children);
    console.log(this.doc);
  }

  findComponent(name, items) {
    let result = null;
    for (let item of items) {
      if (item.name == name) {
        result = item;
      } else if (item.children) {
        result = this.findComponent(name, item.children);
      }

      // TODO: move this all preparation into declarative way somewhere
      if (result) {
        result.inputs = this.findDecorators(result.children, 'Input') || [];
        result.inputs.map((input: any) => {

          let type = input.comment.tags.find((tag: any) => tag.tag === 'type');
          input.type = {
            name: type ? type.text : '',
          };
        });
        result.outputs = this.findDecorators(result.children, 'Output') || [];
        result.component = result.decorators.find((decorator: any) => decorator.name === 'Component');

        let example = result.comment && result.comment.tags && result.comment.tags.find((tag: any) => tag.tag === 'example');
        result.example = example ? example.text.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;") : '';

        let theme = result.comment && result.comment.tags && result.comment.tags.find((tag: any) => tag.tag === 'theme');
        result.theme = theme ? theme.text.replace(/\n/g, "<br>") : '';
        break;
      }
    }
    return result;
  }

  findDecorators(items, name) {
    return items && items.filter((item: any) => {
      return item.decorators && item.decorators.find((decorator: any) => decorator.name === name);
    });
  }
}
