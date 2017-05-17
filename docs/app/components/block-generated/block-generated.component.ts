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
    <ng-container [ngSwitch]="item.tag">
      <ng-container *ngSwitchCase="'description'">
        <h4>{{ doc?.name }} <ng-container *ngIf="doc?.decorator?.selector">({{ doc?.decorator?.selector }})</ng-container></h4>
        <div>
          <strong>{{ doc?.comment?.shortText }}</strong>
          <p>{{ doc?.comment?.text }}</p>
        </div>
      </ng-container>
      
      <ng-container *ngSwitchCase="'inputs'">
        <h5>Inputs</h5>
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
      </ng-container>
      
      <ng-container *ngSwitchCase="'outputs'">
        <h5>Outputs</h5>
      </ng-container>
      
      <ng-container *ngSwitchCase="'methods'">
        <h5>Methods</h5>
        <table class="table" *ngIf="doc?.methods?.length > 0">
          <thead>
            <tr>
              <td>Name</td>
              <td>Parameters</td>
              <td>Returns</td>
              <td>Description</td>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let method of doc?.methods">
              <td>{{ method.name }}</td>
              <td>
                <ng-container *ngFor="let param of method.parameters">{{param.name}}: {{param.type.name}}<br></ng-container>
              </td>
              <td>{{ method.comment?.returns }}</td>
              <td>{{ method.comment?.shortText }}</td>
            </tr>
          </tbody>
        </table>
      </ng-container>
      
      <ng-container *ngSwitchCase="'examples'">
        <h5>Examples</h5>
        <code [innerHtml]="doc?.example"></code>
      </ng-container> 
               
      <ng-container *ngSwitchCase="'theme'">
        <h5>Theme Variables</h5>
        <code [innerHtml]="doc?.theme"></code>
      </ng-container>
      
    </ng-container>    
  `,
})
export class NgdBlockGeneratedComponent {

  @Input() item: any;

  doc: any;

  ngOnInit() {
    this.doc = this.findComponent(this.item.klass, DOCS.children);
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
        let component = result.decorators.find((decorator: any) => decorator.name === 'Component');
        result.decorator = component && component.arguments.obj ? eval(`(${component.arguments.obj})`) : null;

        let example = result.comment && result.comment.tags && result.comment.tags.find((tag: any) => tag.tag === 'example');
        result.example = example ? example.text.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;") : '';

        let theme = result.comment && result.comment.tags && result.comment.tags.find((tag: any) => tag.tag === 'theme');
        result.theme = theme ? theme.text.replace(/\n/g, "<br>") : '';

        let methods = result.children && result.children.filter((item) => item.kindString === 'Method');
        result.methods = methods && methods.map((method: any) => method.signatures[0]);

        console.log(result);
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
