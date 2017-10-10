import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountComponent } from './account.component';
import { AddressesComponent } from './addresses.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Account'
    },
    children: [
      {
        path: '',
        component: AccountComponent,
        data: {
          title: 'Account'
        }
      },{
        path: 'addresses',
        component: AddressesComponent,
        data: {
          title: 'Addresses'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
