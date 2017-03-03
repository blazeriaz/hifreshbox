import { Routes } from '@angular/router';

import { NgaCardTestComponent } from './nga-card-test/nga-card-test.component';
import { NgaLayoutTestComponent } from './nga-layout-test/nga-layout-test.component';
import { NgaSidebarTestComponent } from './nga-sidebar-test/nga-sidebar-test.component';

export const routes: Routes = [
  {
    path: '',
    component: NgaCardTestComponent,
  },
  {
    path: 'nga-layout',
    component: NgaLayoutTestComponent,
  },
  {
    path: 'nga-sidebar',
    component: NgaSidebarTestComponent,
  },
  {
    path: '**',
    component: NgaCardTestComponent,
  },
];
