import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageComponent } from './page.component';
import { ProductComponent } from './product.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Gift'
    },
    children: [
      {
        path: '',
        component: PageComponent,
        data: {
          title: 'Gift'
        }
      }, {
        path: 'product',
        component: ProductComponent,
        data: {
          title: 'Gift Product'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiftRoutingModule {}
