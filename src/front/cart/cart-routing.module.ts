import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CartComponent } from './cart.component';
import { CheckoutComponent } from './checkout.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Cart'
    },
    children: [
      {
        path: '',
        component: CartComponent,
        data: {
          title: 'Cart'
        }
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        data: {
          title: 'Checkout'
        }
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule {}
