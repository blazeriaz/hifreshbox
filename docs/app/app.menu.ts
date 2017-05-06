/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
import { List } from 'immutable';
 */

import { List } from 'immutable';
import { NgaMenuItem } from '../../src/framework/theme';

export const menus: List<NgaMenuItem> = List([
  {
    title: 'Components',
    group: true,
  },
  {
    title: 'Layout',
    link: '/component/layout',
  },
  {
    title: 'Card',
    link: '/component/card',
  },
]);
