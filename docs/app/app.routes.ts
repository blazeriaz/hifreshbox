/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { Routes } from '@angular/router';
import { NgdPageComponent } from './components/page/page.component';

export const routes: Routes = [
  {
    path: '',
    component: NgdPageComponent,
  },
  {
    path: ':page',
    component: NgdPageComponent,
  },
  {
    path: ':page/:sub-page',
    component: NgdPageComponent,
  },
];
