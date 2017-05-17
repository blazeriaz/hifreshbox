/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Injectable } from '@angular/core';
import { List } from 'immutable';
import { NgaMenuItem } from '../../src/framework/theme';

import { STRUCTURE } from '../structure';
var DOCS: any = require('../docs.json');

@Injectable()
export class NgdAppService {

  getStructure(): any {
    return STRUCTURE;
  }

  getDocs(): any {
    return DOCS;
  }

  getPreparedMenu(): any {
    return this.prepareMenu(this.getStructure());
  }

  getPreparedStructure() {
    return this.prepareStructure(this.getStructure(), this.getDocs());
  }

  protected prepareStructure(structure, docs) {
    structure.map((item: any) => {
      if (item.type === 'block' && item.klass) {
        item.klass = this.getKlass(item.klass, docs.children)
      }
      if (item.children) {
        item.children = this.prepareStructure(item.children, docs);
      }
    });
    return structure;
  }

  protected prepareMenu(structure, parent: any = null): any {
    return List<NgaMenuItem>(structure.map((item: any) => {
      const menuItem: any = {};

      menuItem['title'] = item.name;
      menuItem['link'] = `${parent ? parent.link : ''}/${item.name.replace(/\s/, '-').toLowerCase()}`;
      menuItem['data'] = item;
      // TODO: not the best check
      if (item.children && item.children[0] && item.children[0].type === 'page') {
        menuItem['children'] = this.prepareMenu(item.children, menuItem);
      }
      return menuItem;
    }));
  }

  protected getKlass(name, items): any {
    let result = null;
    for (let item of items) {
      if (item.name == name) {
        result = item;
      } else if (item.children) {
        result = this.getKlass(name, item.children);
      }

      if (result) {

        result = this.prepareKlass(result);
        break;
      }
    }
    return result;
  }

  protected prepareKlass(item): any {
    const findDecorators = (items, name) => {
      return items && items.filter((item: any) => {
          return item.decorators && item.decorators.find((decorator: any) => decorator.name === name);
        });
    };

    const safeHtml = (html: string) => {
      return html.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    item.inputs = findDecorators(item.children, 'Input') || [];
    item.inputs.map((input: any) => {
      let type = input.comment && input.comment.tags.find((tag: any) => tag.tag === 'type');
      input.type = {
        name: type ? type.text : '',
      };
    });

    item.outputs = findDecorators(item.children, 'Output') || [];
    // TODO: outputs

    let decorator = item.decorators.find((decorator: any) => decorator.name === 'Component');
    item.decorator = decorator && decorator.arguments.obj ? eval(`(${decorator.arguments.obj})`) : null;

    let example = item.comment && item.comment.tags && item.comment.tags.find((tag: any) => tag.tag === 'example');
    item.example = example ? safeHtml(example.text) : '';

    let theme = item.comment && item.comment.tags && item.comment.tags.find((tag: any) => tag.tag === 'theme');
    item.theme = theme ? theme.text.replace(/\n/g, '<br>') : '';

    let methods = item.children && item.children.filter((item) => item.kindString === 'Method');
    item.methods = methods && methods.map((method: any) => method.signatures[0]);

    return item;
  }
}
